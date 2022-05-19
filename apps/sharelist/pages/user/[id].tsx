import Link from 'next/link';
import { useRouter } from 'next/router';
import UserList from '../../components/UserList';
import { config } from '../../config';

export function UserListPage() {
  const { query } = useRouter();

  const id = config.paths[query.id as string] || (query.id as string);

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
      <UserList id={id}></UserList>
    </>
  );
}

export default UserListPage;
