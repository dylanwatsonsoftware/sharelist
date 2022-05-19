import Link from "next/link";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import AddList from '../components/AddList';
import ListCard from '../components/ListCard';
import { listCollection } from '../firebase/collections';
import { List } from '../models/list';

export function Index() {
  const [lists, loading, error] = useCollectionData<List>(
    listCollection.orderBy('updated', 'desc'),
    {
      idField: 'id',
    }
  );

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Link href="/">
          <a className="list-item-link">My Lists</a>
        </Link>
        <span className="list-item-link active">Friends Lists</span>
      </div>

      <AddList />

      <div className="middle-content">
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && !lists && <span>Loading...</span>}
        {lists?.map((list) => (
          <ListCard list={list} key={list.id}></ListCard>
        ))}
      </div>
    </>
  );
}

export default Index;
