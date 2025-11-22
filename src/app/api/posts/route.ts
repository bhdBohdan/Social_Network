import { NextResponse } from "next/server";
import dbConnect from "@/common/mongoDB/mongo.db";
import Post from "@/common/mongoDB/models/Post";
import { createComment } from "@/common/dynamoDB/dynamoHelpers";

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
  await createComment({
    content: post.content,
    post: post._id.toString(),
    author: author._id.toString(),
    reactions: [],
  });
  return NextResponse.json(post, { status: 201 });
}
