export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Entry {
  id: string;
  [key: string]: string | null;
}

export interface Field {
  id: string;
  name: string;
  type: "string" | "number" | "date";
}

export interface Lorebook {
  id: string;
  author: string;
  title: string;
  entries: { [id: string]: Entry };
  fields: { [id: string]: Field };
}
