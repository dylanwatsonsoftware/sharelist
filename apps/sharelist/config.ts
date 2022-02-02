import firebase from 'firebase/app';
import 'firebase/auth';

export interface PortalEnvironment {
  envName: string;
  production: boolean;
  hmr: boolean;
  paths: Record<string, string>;
  logRocketProject?: string;
  sentryDsn?: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  firebaseAuth: {
    signInFlow: string;
    signInSuccessUrl: string;
    tosUrl: string;
    privacyPolicyUrl: string;
    signInOptions: string[];
  };
}

function getConfig(env: string): PortalEnvironment {
  switch (env) {
    default:
      return {
        envName: env || 'stage',
        production: env === 'prod',
        paths: {},
        hmr: true,

        firebase: {
          apiKey: 'AIzaSyA34Spo49cZCQl-JpZDt2vsyioWgGgcap8',
          authDomain: 'sharelist-5b76d.firebaseapp.com',
          projectId: 'sharelist-5b76d',
          storageBucket: 'sharelist-5b76d.appspot.com',
          messagingSenderId: '1019607397207',
          appId: '1:1019607397207:web:8d58c42d36c115fc7c8412',
          measurementId: 'G-PFYE22ZX74',
        },
        firebaseAuth: {
          signInFlow: 'popup',
          signInSuccessUrl: '/',
          tosUrl: '/terms-of-service',
          privacyPolicyUrl: '/privacy-policy',
          signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          ],
        },
      };
  }
}

export const config = getConfig(process.env.NEXT_PUBLIC_VERCEL_ENV as string);
