import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/databases/mongoDB/mongo.db";
import User from "@/databases/mongoDB/models/User";
import { getNeo4jSession } from "@/databases/neo4Jdb/neo4j.db";

export async function POST(req: Request) {
  const session = await getNeo4jSession();
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

    await session.run(`CREATE (u:User {id: $id, email: $email}) RETURN u`, {
      id: newUser.id.toString(),
      email,
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
  } finally {
    await session.close();
  }
}
