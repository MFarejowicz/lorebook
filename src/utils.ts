import { Lorebook } from "src/firebase";

interface LoreMap {
  [id: string]: Lorebook;
}

export const filterUserLore = (loreMap: LoreMap, userID?: string) => {
  if (!userID) {
    return [];
  }

  const lorebooks = Object.values<Lorebook>(loreMap);
  const userLorebooks = lorebooks.filter((book) => book.author === userID);

  return userLorebooks;
};

export const enterPress = (callback: Function) => {
  return (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") callback();
  };
};
