// your mongoose model

import { authOptions } from "@/common/lib/auth-options";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
