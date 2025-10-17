import { NextResponse } from "next/server";
import dbConnect from "@/common/mongoDB/mongo.db";
import Post from "@/common/mongoDB/models/Post";
import { Reaction } from "@/common/interfaces/Reaction";

export async function POST(req: Request, { params }: any) {
  await dbConnect();
  const { userId, type } = await req.json();
  const { id } = await params;

  if (!userId)
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });

  const post = await Post.findById(id);
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  // Check if user already reacted
  const existing = post.reactions.find(
    (r: Reaction) => r.user.toString() === userId
  );
  if (existing) {
    // Toggle/remove reaction
    post.reactions = post.reactions.filter(
      (r: Reaction) => r.user.toString() !== userId
    );
  } else {
    post.reactions.push({ user: userId, type: type || "like" });
  }

  await post.save();
  return NextResponse.json(post);
}
