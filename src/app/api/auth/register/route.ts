import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/common/lib/mongo.db";
import User from "@/common/lib/models/User";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, ppUrl, interests } =
      await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      ppUrl: ppUrl || null,
      interests: interests || [],
    });

    return NextResponse.json({
      message: "User created",
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        ppUrl: newUser.ppUrl,
        interests: newUser.interests,
        followers: newUser.followers,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
