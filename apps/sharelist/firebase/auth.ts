import 'firebase/auth';
import { useEffect, useState } from 'react';
import { getFirebase } from './firebase';

const auth = () => {
  return getFirebase().auth();
};

const useSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(!!auth().currentUser);
  const [user, setUser] = useState(auth().currentUser);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
      setUser(user);
    });
    return () => unregisterAuthObserver();
  }, []);

  return { isSignedIn, user };
};
export { auth, useSignedIn };
