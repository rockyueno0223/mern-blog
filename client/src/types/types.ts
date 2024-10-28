export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
}

export type FormDataType = {
  [key: string]: string;
};