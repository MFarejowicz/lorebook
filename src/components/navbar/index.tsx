import { useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { FirebaseContext } from "src/firebase";
import "./styles.css";

interface PublicProps {
  signIn: () => void;
  signOut: () => void;
}

type Props = PublicProps;

export const NavBar = (props: Props) => {
  const { user } = useContext(FirebaseContext);
  const location = useLocation();
  const history = useHistory();

  if (location.pathname === "/" && !user) {
    return null;
  }

  const signOut = () => {
    props.signOut();
    history.push("/");
  };

  return (
    <div className="NavBar">
      <>
        <div className="NavBar-title">
          <Link to="/">Lorebook</Link>
        </div>
        {user ? (
          <div className="NavBar-info">
            <div className="NavBar-welcome">Hi, {user.displayName}!</div>
            <button onClick={signOut}>Sign Out</button>
          </div>
        ) : (
          <div className="NavBar-placeholder" />
        )}
      </>
    </div>
  );
};
