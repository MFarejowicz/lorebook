import { useContext, useEffect } from "react";
import ReactModal from "react-modal";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import withFirebaseAuth, { WrappedComponentProps as AuthProps } from "react-with-firebase-auth";
import { NavBar } from "./components/navbar";
import { firebaseAppAuth, FirebaseContext, FirebaseContextManager, providers } from "./firebase";
import { Home } from "./pages/home";
import { Lore } from "./pages/lore";
import { NotFound } from "./pages/not-found";
import "./App.css";

ReactModal.setAppElement("#root");

type Props = AuthProps;

const App = (props: Props) => {
  const { user, signInWithGoogle, signOut } = props;
  const { db } = useContext(FirebaseContext);

  useEffect(() => {
    if (user) {
      const { uid, displayName, email } = user;
      const update = { id: uid, name: displayName, email };
      db.ref(`/users/${uid}`).update(update);
    }
  }, [user, db]);

  return (
    <div className="App">
      <Router>
        <NavBar signIn={signInWithGoogle} signOut={signOut} />
        <Switch>
          <Route exact path="/">
            <Home signIn={signInWithGoogle} />
          </Route>
          <Route path="/lore/:userID">
            <Lore />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

const AppWithFirebase = (props: Props) => {
  const { user } = props;

  return (
    <FirebaseContextManager user={user}>
      <App {...props} />
    </FirebaseContextManager>
  );
};

export default withFirebaseAuth({
  firebaseAppAuth,
  providers,
})(AppWithFirebase);
