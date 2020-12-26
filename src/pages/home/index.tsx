import { useContext } from "react";
import { Link } from "react-router-dom";
import { SignInButton } from "src/components/sign-in-button";
import { FirebaseContext } from "src/firebase";
import "./styles.css";

interface PublicProps {
  signIn: () => void;
}

type Props = PublicProps;

export const Home = (props: Props) => {
  const { user } = useContext(FirebaseContext);

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Home">
      {user ? (
        <div className="Home-feed">
          <div className="Home-column">
            <h1 className="Home-title">Your Lore</h1>
            <div>Lore book 1</div>
            <div>Lore book 2</div>
            <div>
              <Link to={`/lore/${user.uid}`}>See all your lore</Link>
            </div>
          </div>
          <div className="Home-column">
            <h1 className="Home-title">Friends Lore</h1>
            <div>Coming soon!</div>
          </div>
        </div>
      ) : (
        <div className="Home-welcome">
          <h1 className="Home-big-title">Lorebook</h1>
          <SignInButton signIn={props.signIn} />
        </div>
      )}
    </div>
  );
};
