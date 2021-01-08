import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignInButton } from "src/components/sign-in-button";
import { FirebaseContext, Lorebook } from "src/firebase";
import { filterUserLore } from "src/utils";
import "./styles.css";

interface PublicProps {
  signIn: () => void;
}

type Props = PublicProps;

export const Home = (props: Props) => {
  const { user, db } = useContext(FirebaseContext);

  /**
   * data for the lore of the user who's page you're on
   * undefined === not set yet
   * Lorebook[] === set and lore is good (but might be empty!)
   */
  const [myLoreData, setMyLoreData] = useState<Lorebook[]>();

  useEffect(() => {
    const fetchData = async () => {
      const loreSnapshot = await db.ref(`/lore`).once("value");
      setMyLoreData(filterUserLore(loreSnapshot.val(), user?.uid));
    };

    if (user) fetchData();
  }, [user, db]);

  if (user === undefined || myLoreData === undefined) {
    return <div>Loading...</div>;
  }

  const renderMyLore = () => {
    if (myLoreData.length === 0) {
      return (
        <div>
          You don't have any lore yet! Start by adding lore on{" "}
          <Link to={`/lore/${user?.uid}`}>your lore page.</Link>
        </div>
      );
    }

    return (
      <>
        {myLoreData.map((lorebook) => (
          <div key={`lorebook-${lorebook.id}`}>{lorebook.title}</div>
        ))}
        <Link to={`/lore/${user?.uid}`}>See all your lore</Link>
      </>
    );
  };

  return (
    <div className="Home">
      {user ? (
        <div className="Home-feed">
          <div className="Home-column">
            <h1 className="Home-title">Your Lore</h1>
            {renderMyLore()}
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
