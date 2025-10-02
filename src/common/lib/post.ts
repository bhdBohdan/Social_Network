import Post, { PostType } from "./models/Post";
import connectDB from "./mongo.db";

export async function getPosts() {
  await connectDB();
  const posts = await Post.find().populate("author reactions.user");
  return posts;
}

export async function getPostById(id: string): Promise<PostType | null> {
  await connectDB();
  const post = await Post.findById(id).populate("author reactions.user");
  if (!post) return null;
  return post;
}
