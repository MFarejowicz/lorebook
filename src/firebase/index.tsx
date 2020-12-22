import { createContext, PropsWithChildren } from "react";
import firebaseConfig from "./firebaseConfig";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

let firebaseApp: firebase.app.App;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app();
}
export const firebaseAppAuth = firebaseApp.auth();
export const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

interface FirebaseContextValue {
  user?: firebase.User | null;
  db?: firebase.database.Database | null;
}
const DEFAULT_CONTEXT_VALUE: FirebaseContextValue = {
  user: null,
  db: null,
};
export const FirebaseContext = createContext(DEFAULT_CONTEXT_VALUE);
const db = firebase.database();

interface PublicProps {
  user?: firebase.User | null;
}

type Props = PublicProps;

export const FirebaseContextManager = (props: PropsWithChildren<Props>) => {
  const { user, children } = props;

  const value: FirebaseContextValue = {
    user,
    db,
  };

  return <FirebaseContext.Provider value={value} children={children} />;
};
