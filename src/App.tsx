import withFirebaseAuth, { WrappedComponentProps as AuthProps } from "react-with-firebase-auth";
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";
import "firebase/auth";
import "./App.css";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

type Props = AuthProps;

const App = (props: Props) => {
  const { user, signOut, signInWithGoogle } = props;

  if (user)
    console.debug(
      `🥳 ${user.displayName} has signed in from ${user.providerData[0]?.providerId} 🥳`
    );

  return (
    <div>
      {user && <span>Hello, {user.displayName}</span>}
      {user ? (
        <button onClick={signOut}>Sign out</button>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default withFirebaseAuth({
  firebaseAppAuth,
  providers,
})(App);
