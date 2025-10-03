import { NextResponse } from "next/server";
import dbConnect from "@/common/lib/mongo.db";
import Comment from "@/common/lib/models/Comment"; // ✅ make sure you have this model
import { Reaction } from "@/common/interfaces/Reaction";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const { id } = params;
  const { userId, type } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const existing = comment.reactions.find(
    (r: Reaction) => r.user.toString() === userId
  );

  if (existing) {
    // toggle
    comment.reactions = comment.reactions.filter(
      (r: Reaction) => r.user.toString() !== userId
    );
  } else {
    comment.reactions.push({ user: userId, type: type || "like" });
  }

  await comment.save();
  return NextResponse.json(comment);
}
