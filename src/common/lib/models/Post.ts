import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
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

export default mongoose.models.Post || mongoose.model("Post", postSchema);
