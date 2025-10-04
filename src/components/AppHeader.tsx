"use client";

import { LogOut, LogIn } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const hideHeaderOn = ["/signin", "/signup"];
  const shouldHideHeader = hideHeaderOn.includes(pathname);
  if (!shouldHideHeader)
    return (
      <header className="flex items-center justify-between px-6 py-3 bg-gray-100 dark:bg-stone-900 text-white shadow-md">
        <Link
          href="/"
          className="flex flex-row items-center text-lg text-indigo-500 font-bold hover:text-indigo-400 dark:text-indigo-200"
        >
          <img
            className="w-15 h-15 mr-1.5 rounded-full  object-cover"
            src="https://i.pinimg.com/736x/3e/cd/67/3ecd67142c701d0af178b4cf6528ffcf.jpg"
          />
          BhdBlogs
        </Link>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <span className="text-gray-400">Loading...</span>
          ) : session ? (
            <>
              <span className="hidden sm:inline font-bold">
                {session.user.firstName}
              </span>
              <Link href="/profile" className="flex items-center gap-2">
                <img
                  src={session.user.ppUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-13 h-13 mb-2 mt-2 rounded-full border-2 border-indigo-500 object-cover"
                />
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-2xl bg-red-500 px-3 py-1.5 text-sm font-semibold hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut size={40} color="white" />
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-2xl bg-indigo-500 px-3 py-1.5 text-sm font-semibold hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LogIn size={40} color="white" />
            </button>
          )}
        </div>
      </header>
    );
}
