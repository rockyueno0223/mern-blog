export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isAdmin: boolean;
}

export type FormDataType = {
  [key: string]: string;
};
