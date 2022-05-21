import Link from 'next/link';
import UserList from '../components/UserList';

export function Index() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Link href="/">
          <a className="list-item-link">My Lists</a>
        </Link>
        <span className="list-item-link active">Friends Lists</span>
      </div>

      <UserList></UserList>
    </>
  );
}

export default Index;
