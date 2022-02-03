import Image from 'next/image';
import { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { config } from '../config';
import { auth, useSignedIn } from '../firebase/auth';

const uiConfig = {
  ...config.firebaseAuth,
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

const Welcome = () => {
  const { isSignedIn } = useSignedIn();

  return (
    <>
      <div id="hero" className="rounded">
        <div className={'logo-container'}>
          <Image src="/sharelist.png" alt="Sharelist" layout="fill"></Image>
        </div>

        {/* {isSignedIn && (
          <div className="text-container">
            <a onClick={() => auth().signOut()}>Sign-out</a>
          </div>
        )} */}

        {!isSignedIn && (
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
        )}
      </div>
    </>
  );
};

export default Welcome;
