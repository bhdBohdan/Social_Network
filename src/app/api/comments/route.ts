import { NextResponse } from "next/server";
import Comment from "@/common/mongoDB/models/Comment";
import connectDB from "@/common/mongoDB/mongo.db";
import {
  createComment,
  getAllDataByPostId,
} from "@/common/dynamoDB/dynamoHelpers";

// GET /api/comments?postId=123
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { message: "postId query param is required" },
        { status: 400 }
      );
    }

    // Find comments for a specific post
    // const comments = await Comment.find({ post: postId })
    //   .populate("author", "firstName lastName ppUrl") // populate user info
    //   .sort({ createdAt: -1 }); // newest first
    const comments = await getAllDataByPostId(postId);

    return NextResponse.json(comments, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to fetch comments", error: err.message },
      { status: 500 }
    );
  }
}

// POST /api/comments
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { author, post, content } = body;

    if (!author || !post || !content?.trim()) {
      return NextResponse.json(
        { message: "Author, postId, and content are required." },
        { status: 400 }
      );
    }

    // const newComment = await Comment.create({
    //   author,
    //   post,
    //   content,
    // });

    const newComment = await createComment({
      content,
      post: post.toString(),
      author: author.toString(),
      reactions: [],
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to add comment", error: err.message },
      { status: 500 }
    );
  }
}
