import { NextResponse } from "next/server";
import dbConnect from "@/databases/mongoDB/mongo.db";
import Post from "@/databases/mongoDB/models/Post";
import { createComment } from "@/databases/dynamoDB/dynamoHelpers";
import redis from "@/databases/redis/redis.db";

export async function GET() {
  const cacheKey = "posts:list";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("⚡ Returning posts from Redis cache");
      return NextResponse.json(JSON.parse(cached));
    }

    await dbConnect();
    const posts = await Post.find()
      .populate("author reactions.user")
      .sort({ createdAt: -1 })
      .lean();

    await redis.set(cacheKey, JSON.stringify(posts), "EX", 60);

    console.log("🐢 Returning posts from DB and caching in Redis");
    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json([], { status: 500 });
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
