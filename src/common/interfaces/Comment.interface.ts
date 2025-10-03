import { Types } from "mongoose";
import { PostUser } from "./AuthUser";

export interface Comment {
  _id: Types.ObjectId | string;
  content: string;

  post: Types.ObjectId | string;
  author: PostUser;
  reactions: { user: { _id: string }; type: string }[];
}
