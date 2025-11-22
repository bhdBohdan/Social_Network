import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/databases/mongoDB/models/User";
import connectDB from "../databases/mongoDB/mongo.db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("authorize called with:", credentials);
        if (!credentials?.email || !credentials.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        console.log("found user:", user);
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        console.log("password valid:", valid);
        if (!valid) return null;

        const result = {
          id: user.id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          interests: user.interests,
          ppUrl: user.ppUrl,
          followers: user.followers
            ? user.followers.map((f: any) => f.toString())
            : [],
        };
        console.log("authorize returning:", result);
        return result;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log("JWT callback - user:", user); // Debug log
      // console.log("JWT callback - token before:", token); // Debug log

      // Initial sign in - user exists
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.ppUrl; // Map to image
        token.ppUrl = user.ppUrl;
        token.interests = user.interests;
        token.followers = user.followers;
      }

      // Subsequent calls - user is undefined, but we need to preserve custom fields
      if (!user && token) {
        // Ensure our custom fields persist
        token.id = token.id;
        token.firstName = token.firstName;
        token.lastName = token.lastName;
        token.image = token.ppUrl; // Keep image mapped
        token.ppUrl = token.ppUrl;
        token.interests = token.interests;
        token.followers = token.followers;
      }

      if (trigger === "update" && session) {
        token.firstName = session.firstName ?? token.firstName;
        token.lastName = session.lastName ?? token.lastName;
        token.ppUrl = session.ppUrl ?? token.ppUrl;
        token.interests = session.interests ?? token.interests;
      }

      // console.log("JWT callback - token after:", token);
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback - token:", token);
      // console.log("Session callback - session before:", session);

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.image = token.image as string;
        session.user.ppUrl = token.ppUrl as string;
        session.user.interests = token.interests as string[];
        session.user.followers = token.followers as string[];
      }

      console.log("Session callback - session after:", session); // Debug log
      return session;
    },
  },
  pages: {
    signIn: "/signin",

    //     signOut: "/app/signin",
    //     // Custom sign-in page (optional)
    //     //signUp: "/auth/signup", // Custom sign-up page (optional)
    //     // error: "/auth/error", // Error page (optional)
  },
  secret: process.env.NEXTAUTH_SECRET,
};
