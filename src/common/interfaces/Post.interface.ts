import { PostUser } from "./AuthUser";

export interface Post {
  _id: string;
  content: string;
  author: PostUser;
  reactions: { user: { _id: string }; type: string }[];
}
