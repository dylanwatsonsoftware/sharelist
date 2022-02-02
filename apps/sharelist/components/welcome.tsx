import Image from 'next/image';
import { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { config } from '../config';
import { auth } from '../firebase/auth';

const uiConfig = {
  ...config.firebaseAuth,
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

const Welcome = () => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [showSignInButtons, setShowSignInButtons] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = auth().onAuthStateChanged((user) => {
      setShowSignInButtons(false);
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <>
      {isSignedIn && (
        <div id="welcome">
          <h1>
            <span>Hello there, {auth().currentUser?.displayName || ''}</span>
            Welcome to ShareList 👋
          </h1>
        </div>
      )}

      <div id="hero" className="rounded">
        {!isSignedIn && (
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
        )}

        {isSignedIn && (
          <div className="text-container">
            <a onClick={() => auth().signOut()}>Sign-out</a>
          </div>
        )}

        <div className={'logo-container'}>
          <Image src="/sharelist.png" alt="Sharelist" layout="fill"></Image>
        </div>
      </div>
    </>
  );
};

export default Welcome;
