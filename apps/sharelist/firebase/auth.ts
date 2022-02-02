import 'firebase/auth';
import { getFirebase } from './firebase';

const auth = () => {
  return getFirebase().auth();
};

export { auth };
