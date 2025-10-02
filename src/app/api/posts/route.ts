import { NextResponse } from "next/server";
import dbConnect from "@/common/lib/mongo.db";
import Post from "@/common/lib/models/Post";

export async function GET() {
  await dbConnect();
  setTimeout(() => {}, 1500);
  const posts = await Post.find().populate("author reactions.user");
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  await dbConnect();
  const { author, content } = await req.json();

  if (!author || !content) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const post = await Post.create({ author, content });
  return NextResponse.json(post, { status: 201 });
}
