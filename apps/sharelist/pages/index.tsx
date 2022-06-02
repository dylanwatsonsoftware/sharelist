import Head from "next/head";
import Link from "next/link";
import UserList from '../components/UserList';
import { useSignedIn } from '../firebase/auth';

export function UserListPage() {
  const { user } = useSignedIn();

  return (
    <>
      {user && (
        <div style={{ display: 'flex' }}>
          <Head>
            <title>ShareList - My Lists</title>
          </Head>
          <span className="list-item-link active">My Lists</span>
          <Link href="/friends">
            <a className="list-item-link">Friends Lists</a>
          </Link>
        </div>
      )}
      <UserList id={user?.uid}></UserList>
    </>
  );
}

export default UserListPage;
