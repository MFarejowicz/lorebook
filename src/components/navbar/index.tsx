import { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
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
      {user ? (
        <>
          <div className="NavBar-welcome">Hi, {user.displayName}!</div>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <div className="NavBar-placeholder" />
      )}
    </div>
  );
};
