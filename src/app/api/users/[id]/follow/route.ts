import { NextResponse } from "next/server";
import { Types } from "mongoose";
import User from "@/common/mongoDB/models/User";
import connectDB from "@/common/mongoDB/mongo.db";

export async function PUT(req: Request, { params }: any) {
  try {
    const { id } = await params;
    await connectDB();

    const { currentUserId } = await req.json();
    const targetUserId = id;

    // Validate IDs
    if (
      !Types.ObjectId.isValid(currentUserId) ||
      !Types.ObjectId.isValid(targetUserId)
    ) {
      return NextResponse.json(
        { error: "Invalid user id(s)" },
        { status: 400 }
      );
    }

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isFollowing = targetUser.followers.some(
      (f: Types.ObjectId) => f.toString() === currentUserId
    );

    if (isFollowing) {
      targetUser.followers = targetUser.followers.filter(
        (f: Types.ObjectId) => f.toString() !== currentUserId
      );
    } else {
      targetUser.followers.push(new Types.ObjectId(currentUserId));
    }

    await targetUser.save();

    return NextResponse.json(
      {
        message: isFollowing
          ? "Unfollowed successfully"
          : "Followed successfully",
        followers: targetUser.followers,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
