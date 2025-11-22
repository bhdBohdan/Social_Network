import { NextResponse } from "next/server";
import Comment from "@/databases/mongoDB/models/Comment";
import connectDB from "@/databases/mongoDB/mongo.db";
import { updateComment } from "@/databases/dynamoDB/dynamoHelpers";

// DELETE /api/comments/:id
export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;
    // await connectDB();
    // await Comment.findByIdAndDelete(id);

    await deleteComment(id);

    return NextResponse.json({ message: "Comment deleted" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to delete comment", error: err.message },
      { status: 500 }
    );
  }
}

// PATCH /api/comments/:id (edit content)
export async function PATCH(req: Request, context: any) {
  try {
    const { id } = context.params;
    //await connectDB();
    const body = await req.json();

    // const updated = await Comment.findByIdAndUpdate(
    //   id,
    //   { content: body.content },
    //   { new: true }
    // );

    const updated = await updateComment(
      id,
      `COMMENT#${body.createdAt}`,
      body.content
    );

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to update comment", error: err.message },
      { status: 500 }
    );
  }
}
function deleteComment(id: any) {
  throw new Error("Function not implemented.");
}
