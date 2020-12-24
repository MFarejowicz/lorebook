import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import withFirebaseAuth, { WrappedComponentProps as AuthProps } from "react-with-firebase-auth";
import { NavBar } from "./components/navbar";
import { firebaseAppAuth, FirebaseContextManager, providers } from "./firebase";
import { Home } from "./pages/home";
import { Lore } from "./pages/lore";
import { NotFound } from "./pages/not-found";
import "./App.css";

type Props = AuthProps;

const App = (props: Props) => {
  const { user, signInWithGoogle, signOut } = props;

  useEffect(() => {
    if (user) {
      // console.log(user);
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
            <Route path="/lore/:userID">
              <Lore />
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
