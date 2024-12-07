export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes: Array<string>;
  numberOfLikes: number;
  createdAt: string;
}

export type FormDataType = {
  [key: string]: string;
};
