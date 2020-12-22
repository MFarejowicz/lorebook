import { createContext } from "react";
import withFirebaseAuth, { WrappedComponentProps as AuthProps } from "react-with-firebase-auth";
import firebase from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import { Home } from "./pages/home";
import "firebase/auth";
import "firebase/database";
import "./App.css";

let firebaseApp: firebase.app.App;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app();
}
const firebaseAppAuth = firebaseApp.auth();
const providers = {
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

type Props = AuthProps;

const App = (props: Props) => {
  const { user, signOut, signInWithGoogle } = props;

  const signIn = () => {
    signInWithGoogle().then((res) => {
      const { user } = res;

      if (user) {
        db.ref(`users/${user.uid}`).set({
          name: user.displayName,
          email: user.email,
          id: user.uid,
        });
      }
    });
  };

  return (
    <FirebaseContext.Provider value={{ user: user, db: db }}>
      <div>
        {user && (
          <>
            <span>Hello, {user.displayName}</span>
            <Home />
          </>
        )}
        {user ? (
          <button onClick={signOut}>Sign out</button>
        ) : (
          <button onClick={signIn}>Sign in with Google</button>
        )}
      </div>
    </FirebaseContext.Provider>
  );
};

export default withFirebaseAuth({
  firebaseAppAuth,
  providers,
})(App);
