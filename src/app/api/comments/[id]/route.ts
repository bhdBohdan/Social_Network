import { NextResponse } from "next/server";
import Comment from "@/common/lib/models/Comment";
import connectDB from "@/common/lib/mongo.db";

// DELETE /api/comments/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    await Comment.findByIdAndDelete(id);

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
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const body = await req.json();

    const updated = await Comment.findByIdAndUpdate(
      id,
      { content: body.content },
      { new: true }
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
