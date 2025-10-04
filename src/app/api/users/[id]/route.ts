import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/common/db/mongo.db";
import User from "@/common/db/models/User";
import { UpdateUser } from "@/common/interfaces/AuthUser";

// GET /api/users/:id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/users/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body: UpdateUser = await req.json();

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const allowedUpdates = ["firstName", "lastName", "ppUrl", "interests"];

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      {
        $set: {
          lastName: body.lastName,
          firstName: body.firstName,
          ppUrl: body.ppUrl,
          interests: Array.isArray(body.interests) ? body.interests : [],
        },
      },
      { new: true }
    ).select("-password"); //omit pass

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
