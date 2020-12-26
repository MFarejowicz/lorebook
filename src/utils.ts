import { Lorebook } from "src/firebase";

interface LoreMap {
  [id: string]: Lorebook;
}

export const filterUserLore = (loreMap: LoreMap, userID: string) => {
  const lorebooks = Object.values<Lorebook>(loreMap);
  const userLorebooks = lorebooks.filter((book) => book.author === userID);

  return userLorebooks;
};
