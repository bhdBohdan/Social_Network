"use client";

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
        <Link href="/" className="text-lg font-bold hover:text-indigo-400">
          MyApp
        </Link>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <span className="text-gray-400">Loading...</span>
          ) : session ? (
            <>
              <span className="hidden sm:inline">{session.user.firstName}</span>
              <div className="flex items-center gap-2">
                <img
                  src={session.user.ppUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-13 h-13 mb-2 mt-2 rounded-full border-2 border-indigo-500 object-cover"
                />
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          )}
        </div>
      </header>
    );
}
