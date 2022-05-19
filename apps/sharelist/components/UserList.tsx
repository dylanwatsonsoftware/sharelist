import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useSignedIn } from '../firebase/auth';
import { listCollection } from '../firebase/collections';
import { List } from '../models/list';
import AddList from './AddList';
import ListCard from './ListCard';

export const UserList = ({ id }: { id: string }) => {
  const { user } = useSignedIn();
  const [lists, loading, error] = useCollectionData<List>(
    listCollection.where('userId', '==', id || '').orderBy('updated', 'desc'),
    {
      idField: 'id',
    }
  );

  const userName = lists?.[0]?.userName;

  return (
    <>
      {userName && <h3>{userName}&apos;s Lists</h3>}

      {user?.uid == id && <AddList />}

      <div className="middle-content">
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && !lists && <span>Loading...</span>}
        {lists &&
          lists.map((list) => <ListCard list={list} key={list.id}></ListCard>)}
      </div>
    </>
  );
};

export default UserList;
