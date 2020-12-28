export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Entry {
  id: string;
  [key: string]: string | null;
}

export type FieldType = "text" | "number" | "date";

export interface Field {
  id: string;
  name: string;
  type: FieldType;
}

/**
 * Like a Field, but has no id
 */
export type PreField = Pick<Field, "name" | "type">;

export interface Lorebook {
  id: string;
  author: string;
  title: string;
  entries?: { [id: string]: Entry };
  fields?: { [id: string]: Field };
}
