import { NextResponse } from "next/server";
import dbConnect from "@/common/lib/mongo.db";
import Post from "@/common/lib/models/Post";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const post = await Post.findById(params.id).populate("author reactions.user");
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { content } = await req.json();
  const post = await Post.findByIdAndUpdate(
    params.id,
    { content },
    { new: true }
  );
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const post = await Post.findByIdAndDelete(params.id);
  if (!post)
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
