import { useRouter } from 'next/router';
import UserList from '../../components/UserList';
import { config } from '../../config';

export function UserListPage() {
  const { query } = useRouter();

  const id = config.paths[query.id as string] || (query.id as string);

  return <UserList id={id}></UserList>;
}

export default UserListPage;
