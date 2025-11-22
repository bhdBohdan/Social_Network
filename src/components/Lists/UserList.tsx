import Link from "next/link";
import { Skeleton } from "../Skeleton";
import { getRelationshipStatus } from "@/databases/neo4Jdb/helpers";

interface UserResponse {
  _id: string;
  firstName: string;
  email: string;
  ppUrl: string;
  followers: string[];
}

export default async function UsersList({ userId }: { userId?: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/users`,
    {
      cache: "no-store",
    }
  );
  const users: UserResponse[] = await res.json();

  const relMap: Record<
    string,
    { isFollowing: boolean; isFollowedBy: boolean; isMutual: boolean }
  > = {};
  if (userId && users.length) {
    const checks = await Promise.all(
      // not optimal, each call for each user
      users.map((u) =>
        getRelationshipStatus(userId, u._id).catch(() => ({
          isFollowing: false,
          isFollowedBy: false,
          isMutual: false,
        }))
      )
    );
    checks.forEach((c, i) => {
      relMap[users[i]._id] = {
        isFollowing: !!c.isFollowing,
        isMutual: !!c.isMutual,
        isFollowedBy: !!c.isFollowedBy,
      };
    });
  }

  if (!users || users.length === 0) return <Skeleton />;

  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-stone-700"
        >
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
              {userId && relMap[user._id]?.isMutual ? (
                <span className="font-bold text-pink-600">Friend</span>
              ) : relMap[user._id]?.isFollowedBy ? (
                <span className="font-bold text-green-600">Follows you</span>
              ) : (
                relMap[user._id]?.isFollowing && (
                  <span className="font-bold text-cyan-600">Following</span>
                )
              )}
              {userId === user._id && (
                <span className="font-bold text-red-600">This is you</span>
              )}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
