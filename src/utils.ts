import { useEffect, useRef } from "react";
import { FieldType, Lorebook } from "src/firebase";

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

export const initialEditable = (initialValue: string | boolean | null, type: FieldType) => {
  if (initialValue) {
    return initialValue;
  }

  if (type === "checkbox") {
    return false;
  }

  return "---";
};

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current as T;
}
