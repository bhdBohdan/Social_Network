import { authOptions } from "@/common/auth-options";
import { UserInfo } from "@/common/interfaces/AuthUser";
import FollowButton from "@/components/Buttons/FollowButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Key } from "react";
import {
  getRelationshipStatus,
  getDistanceBetweenUsers,
} from "@/databases/neo4Jdb/helpers";

interface ProfilePageProps {
  params: any;
}

async function getUserData(userId: string): Promise<UserInfo | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}`,
      {
        cache: "no-store", // Ensure fresh data
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch user data");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function Profile({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);

  if (session && session.user?.id === params.id) {
    redirect("/profile");
  }

  const user = await getUserData(params.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The user you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user.id === user._id;
  const isFollowingFromMongo = session
    ? user.followers.includes(session.user.id)
    : false;

  // srver-side Neo4j checks
  let neo4jRel = { isFollowing: false, isFollowedBy: false, isMutual: false };
  let distance: number | null = null;
  if (session && !isOwnProfile) {
    try {
      const [rel, d] = await Promise.all([
        getRelationshipStatus(session.user.id, user._id).catch(() => ({
          isFollowing: false,
          isFollowedBy: false,
          isMutual: false,
        })),
        getDistanceBetweenUsers(session.user.id, user._id).catch(() => null),
      ]);
      neo4jRel = rel;

      distance = typeof d === "number" ? d : d === null ? null : Number(d);
    } catch (e) {
      console.error("Neo4j check failed:", e);
    }
  }

  const isFollowing = session
    ? neo4jRel
      ? !!neo4jRel.isFollowing
      : isFollowingFromMongo
    : false;
  const isMutual = !!neo4jRel.isMutual;
  const isFollowedBy = !!neo4jRel.isFollowedBy;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-gray-200 dark:border-stone-700 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={user.ppUrl || "/default-avatar.png"}
                    alt={`${user.firstName} ${user.lastName}&apos;s profile`}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-stone-800 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                  {session && !isOwnProfile && (
                    <span className="ml-3 text-sm inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100 dark:bg-stone-700 text-gray-700 dark:text-gray-200">
                      {isMutual ? (
                        <strong>Friend</strong>
                      ) : isFollowedBy ? (
                        <strong>Follows you</strong>
                      ) : isFollowing ? (
                        <strong>Following</strong>
                      ) : distance == 2 ? (
                        <strong>Friend of your friend</strong>
                      ) : (
                        "Not following"
                      )}
                      {isMutual && (
                        <span className="text-xs text-cyan-600">• Mutual</span>
                      )}
                      {distance !== null && (
                        <span className="text-xs text-gray-500 ml-1">
                          • dist: {distance}
                        </span>
                      )}
                    </span>
                  )}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {user.email}
                </p>

                {/* Interests */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                    Interests
                  </h3>
                  {user.interests && user.interests.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.interests.map(
                        (interest: string, index: Key | null | undefined) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {interest.trim()}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      No interests added yet
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4 max-w-xs">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {/* add posts count here when you have the data */}0
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Posts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.followers.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Followers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-stone-800 transition-colors duration-200">
                  Edit Profile
                </button>
                <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-stone-600 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-stone-700 hover:bg-gray-50 dark:hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-stone-800 transition-colors duration-200">
                  Share Profile
                </button>
              </div>
            )}
            {!isOwnProfile && session?.user?.id && (
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <FollowButton
                  userId={user._id}
                  currentUserId={session.user.id}
                  isFollowing={isFollowing}
                />
                <div className="ml-3 self-center text-sm text-gray-600 dark:text-gray-300">
                  {isMutual
                    ? "Mutual follow"
                    : neo4jRel.isFollowedBy
                    ? "Follows you"
                    : "Not following you"}
                  {distance !== null && (
                    <span className="ml-2">• distance {distance}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-gray-200 dark:border-stone-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No recent activity
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-gray-200 dark:border-stone-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Details
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Member since
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {memberSince}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last updated
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account status
                </dt>
                <dd className="text-sm text-green-600 dark:text-green-400">
                  Active
                </dd>
              </div>
              {isOwnProfile && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email status
                  </dt>
                  <dd className="text-sm text-green-600 dark:text-green-400">
                    Verified
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
