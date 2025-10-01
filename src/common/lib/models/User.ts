// common/lib/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string; // store hash, not plain text
  firstName: string;
  lastName: string;
  ppUrl?: string;
  interests: string[];
  followers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hash!
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    ppUrl: { type: String, required: false },
    interests: [{ type: String }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
