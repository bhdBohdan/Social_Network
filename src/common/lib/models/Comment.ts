// models/Comment.js
import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    reactions: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["like"], default: "like" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);
