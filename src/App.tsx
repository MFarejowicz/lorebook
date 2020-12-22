import { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import withFirebaseAuth, { WrappedComponentProps as AuthProps } from "react-with-firebase-auth";
import { firebaseAppAuth, FirebaseContextManager, providers } from "./firebase";
import { Home } from "./pages/home";
import { NotFound } from "./pages/not-found";
import { NavBar } from "./components/navbar";
import "./App.css";

type Props = AuthProps;

const App = (props: Props) => {
  const { user, signInWithGoogle, signOut, loading } = props;
  console.log(loading);

  useEffect(() => {
    if (user) {
      console.log(user);
      // log to firebase here?
    }
  }, [user]);

  return (
    <FirebaseContextManager user={user}>
      <div className="App">
        <Router>
          <NavBar signIn={signInWithGoogle} signOut={signOut} />
          <Switch>
            <Route exact path="/">
              <Home signIn={signInWithGoogle} />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </div>
    </FirebaseContextManager>
  );
};

export default withFirebaseAuth({
  firebaseAppAuth,
  providers,
})(App);
