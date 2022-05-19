import UserList from '../components/UserList';
import { useSignedIn } from '../firebase/auth';

export function UserListPage() {
  const { user } = useSignedIn();

  if (!user) {
    <div>Signing in...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
      </div>
      <UserList id={user?.uid}></UserList>
    </>
  );
}

export default UserListPage;
