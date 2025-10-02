import { NextResponse } from "next/server";
import dbConnect from "@/common/lib/mongo.db";
import Post from "@/common/lib/models/Post";

type Reaction = {
  user: string;
  type: string;
};

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { userId, type } = await req.json();

  if (!userId)
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });

  const post = await Post.findById(params.id);
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
