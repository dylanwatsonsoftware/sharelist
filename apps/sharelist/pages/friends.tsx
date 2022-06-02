import Head from "next/head";
import Link from 'next/link';
import UserList from '../components/UserList';

export function Index() {
  return (
    <>
      <Head>
        <title>ShareList - Friends Lists</title>
      </Head>
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
