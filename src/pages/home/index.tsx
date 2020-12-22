import { useContext } from "react";
import { SignInButton } from "src/components/sign-in-button";
import { FirebaseContext } from "src/firebase";
import "./styles.css";

interface PublicProps {
  signIn: () => void;
}

type Props = PublicProps;

export const Home = (props: Props) => {
  const { user } = useContext(FirebaseContext);

  return (
    <div className="Home">
      {user ? <span>Hello, {user.displayName}</span> : <SignInButton signIn={props.signIn} />}
    </div>
  );
};
