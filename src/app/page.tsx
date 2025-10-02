import { getServerSession } from "next-auth";
import { authOptions } from "@/common/lib/auth-options";

import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  console.log(session?.user);

  return (
    <div className="p-5 m-5">
      {!session && (
        <Link
          className="mb-9 flex w-25 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          href="/api/auth/signin"
        >
          Sign in
        </Link>
      )}

      <Link
        className="mb-9 flex w-25 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        href="/posts/add"
      >
        Add post
      </Link>

      <h1>Welcome {session?.user?.name}!</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Email: {session?.user?.firstName}</p>
      <a href={session?.user?.ppUrl}>Url: {session?.user?.ppUrl}</a>
      <img
        src={session?.user?.ppUrl}
        alt="Profile"
        className="rounded-xs w-40 h-40 z-50"
      />

      <p></p>
    </div>
  );
}
