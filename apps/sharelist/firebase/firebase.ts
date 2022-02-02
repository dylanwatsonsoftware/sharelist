import firebase from 'firebase/app';
import 'firebase/firestore';
import { config } from '../config';

const getFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebase);
  }

  return firebase.app();
};

export { getFirebase };
