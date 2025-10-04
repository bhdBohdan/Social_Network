"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "../Skeleton";

interface UserResponse {
  _id: string;
  firstName: string;
  email: string;
  ppUrl: string;
  followers: string[];
}

export default function UsersList({ userId }: { userId?: string }) {
  const [users, setusers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchusers() {
    setLoading(true);
    const res = await fetch("/api/users", { cache: "no-store" });
    const data = await res.json();
    setusers(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchusers();
  }, []);

  return loading ? (
    <Skeleton />
  ) : (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-stone-700">
          {user.ppUrl ? (
            <img
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-stone-600"
              src={user.ppUrl}
              alt={`${user.firstName}`}
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-stone-600 dark:from-blue-600 dark:to-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {user.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <div>
            <Link
              href={`/profile/${user._id}`}
              className="text-sm font-medium text-gray-700 dark:text-stone-200"
            >
              {user.firstName}{" "}
              {userId && user.followers.includes(userId) && (
                <span className="font-bold text-cyan-600">Following</span>
              )}
            </Link>
            <p className="text-xs text-gray-500 dark:text-stone-400">
              {/* timestamp here if needed */}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
