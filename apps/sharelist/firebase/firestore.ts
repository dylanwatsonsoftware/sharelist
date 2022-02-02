import 'firebase/firestore';
import { getFirebase } from './firebase';

const firestore = () => {
  return getFirebase().firestore();
};

export { firestore };
