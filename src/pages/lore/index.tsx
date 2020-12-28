import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LorebookDisplay } from "src/components/lorebook";
import { FirebaseContext, Lorebook, User } from "src/firebase";
import { filterUserLore } from "src/utils";
import "./styles.css";

interface LoreParams {
  userID: string;
}

export const Lore = () => {
  const { user, db } = useContext(FirebaseContext);
  const { userID } = useParams<LoreParams>();

  /**
   * data for the user who's page you're on
   * undefined === not set yet
   * null === set but no such user
   * User === set and user is good
   */
  const [userData, setUserData] = useState<User | null>();
  /**
   * data for the lore of the user who's page you're on
   * undefined === not set yet
   * Lorebook[] === set and lore is good (but might be empty!)
   */
  const [loreData, setLoreData] = useState<Lorebook[]>();

  useEffect(() => {
    const fetchData = async () => {
      const userSnapshot = await db.ref(`/users/${userID}`).once("value");
      setUserData(userSnapshot.val());

      const loreSnapshot = await db.ref(`/lore`).once("value");
      setLoreData(filterUserLore(loreSnapshot.val(), userID));
    };

    fetchData();
  }, [db, userID]);

  if (userData === undefined) {
    return <div className="Lore">Loading...</div>;
  }

  if (userData === null) {
    return <div className="Lore">User not found!</div>;
  }

  const onAddNewLorebook = async () => {
    const loreSnapshot = await db.ref(`/lore`).once("value");
    setLoreData(filterUserLore(loreSnapshot.val(), userID));
  };

  const isOwner = () => {
    return user?.uid === userData.id;
  };

  const renderTitle = () => {
    return isOwner() ? <h1>Your Lore</h1> : <h1>{userData.name}'s Lore</h1>;
  };

  const renderNoLore = () => {
    return isOwner() ? (
      <div>You don't have any lore yet! Start by adding a lorebook.</div>
    ) : (
      <div>{userData.name} doesn't have any lore!</div>
    );
  };

  const renderLore = () => {
    if (loreData === undefined) {
      return (
        <>
          {renderTitle()}
          <div>Loading Lore...</div>
        </>
      );
    }

    return (
      <>
        {renderTitle()}
        {loreData.length === 0 ? (
          renderNoLore()
        ) : (
          <LorebookDisplay
            lore={loreData}
            editable={isOwner()}
            onAddNewLorebook={onAddNewLorebook}
          />
        )}
      </>
    );
  };

  return <div className="Lore">{renderLore()}</div>;
};
