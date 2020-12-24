import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FirebaseContext, User } from "src/firebase";

interface LoreParams {
  userID: string;
}

export const Lore = () => {
  const { user, db } = useContext(FirebaseContext);
  const { userID } = useParams<LoreParams>();

  /** data for the user who's page you're on */
  const [userData, setUserData] = useState<User | null>();

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await db.ref(`/users/${userID}`).once("value");
      setUserData(snapshot.val());
    };

    fetchData();
  }, [db, userID]);

  if (userData === undefined) {
    return <div>Loading...</div>;
  }

  if (userData === null) {
    return <div>User not found!</div>;
  }

  return (
    <div>{user?.uid === userData.id ? <h1>Your Lore</h1> : <h1>{userData.name}'s Lore</h1>}</div>
  );
};
