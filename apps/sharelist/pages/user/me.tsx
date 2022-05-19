import Link from 'next/link';
import UserList from '../../components/UserList';
import { useSignedIn } from '../../firebase/auth';

export function UserListPage() {
  const { user } = useSignedIn();

  if (!user) {
    <div>Signing in...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Link href="/">
          <a className="list-item-link">My Lists</a>
        </Link>
        <Link href="/friends">
          <a className="list-item-link">Friends Lists</a>
        </Link>
      </div>
      <UserList id={user?.uid}></UserList>
    </>
  );
}

export default UserListPage;
