export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isAdmin: boolean;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  slug: string;
  updatedAt: string;
}

export type FormDataType = {
  [key: string]: string;
};
