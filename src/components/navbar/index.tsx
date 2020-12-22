import { useContext } from "react";
import { FirebaseContext } from "src/firebase";
import { SignInButton } from "src/components/sign-in-button";
import "./styles.css";

interface PublicProps {
  signIn: () => void;
  signOut: () => void;
}

type Props = PublicProps;

export const NavBar = (props: Props) => {
  const { user } = useContext(FirebaseContext);

  return (
    <div className="NavBar">
      {user && <div>Hi, {user.displayName}!</div>}
      {user ? (
        <button onClick={props.signOut}>Sign Out</button>
      ) : (
        <SignInButton signIn={props.signIn} />
      )}
    </div>
  );
};
