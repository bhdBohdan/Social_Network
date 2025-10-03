import { NextResponse } from "next/server";
import dbConnect from "@/common/lib/mongo.db";
import Post from "@/common/lib/models/Post";
import Comment from "@/common/lib/models/Comment";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = await params;

  const post = await Post.findById(id).populate("author reactions.user");
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = await params;

  const { content } = await req.json();
  const post = await Post.findByIdAndUpdate(id, { content }, { new: true });
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = await params;

  const post = await Post.findByIdAndDelete(id);
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  // Delete all comments referencing this post
  await Comment.deleteMany({ postId: id });

  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}
