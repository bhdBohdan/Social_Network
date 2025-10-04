import { getServerSession } from "next-auth";
import { authOptions } from "@/common/auth-options";

import Link from "next/link";
import PostsList from "@/components/Lists/PostsList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  console.log(session?.user);

  return (
    <div className="p-5 m-5">
      <div className="flex flex-row ">
        <Link
          className="mb-9 ml-5 mr-5 flex w-25 justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          href="/posts/add"
        >
          Add post
        </Link>
        <Link
          className="mb-9 flex w-25 justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          href="/users"
        >
          All Users
        </Link>
      </div>

      <PostsList userId={session?.user.id || ""} />
    </div>
  );
}
