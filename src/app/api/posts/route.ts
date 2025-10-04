import { NextResponse } from "next/server";
import dbConnect from "@/common/db/mongo.db";
import Post from "@/common/db/models/Post";

export async function GET() {
  try {
    await dbConnect();
    const posts = await Post.find()
      .populate("author reactions.user")
      .sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json([]);
  }
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
