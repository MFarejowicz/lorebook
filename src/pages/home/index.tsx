import { useContext } from "react";
import { FirebaseContext } from "../../App";

export const Home = () => {
  const { user } = useContext(FirebaseContext);

  return <div>{user?.displayName}</div>;
};
