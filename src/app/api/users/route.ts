import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/common/db/mongo.db";
import User from "@/common/db/models/User";
import { UpdateUser } from "@/common/interfaces/AuthUser";

// GET /api/users/:id
export async function GET(req: Request) {
  try {
    await connectDB();

    const users = await User.find()
      .select("_id firstName email ppUrl followers ")
      .sort({ createdAt: -1 });

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
