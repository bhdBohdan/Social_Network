import { Types } from "mongoose";

export interface AuthUser {
  email: string;
  firstName: string;
  id: string;
  image?: string;
  interests?: string;
  lastName: string;
  ppUrl?: string;
}

export interface PostUser {
  _id: string;
  email: string;
  firstName?: string;
  image?: string;
  lastName?: string;
  ppUrl?: string;
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  ppUrl?: string; // profile picture URL
  interests: string[];
  followers: Types.ObjectId[] | IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  ppUrl?: string;
  interests: string[];
}
