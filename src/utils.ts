import { Lorebook } from "src/firebase";

interface LoreMap {
  [id: string]: Lorebook;
}

export const mapToArray = (loreMap: LoreMap | null) => {
  if (!loreMap) {
    return [];
  }

  return Object.values<Lorebook>(loreMap);
};

export const enterPress = (callback: Function) => {
  return (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") callback();
  };
};
