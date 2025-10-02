import { authOptions } from "@/common/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Key } from "react";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  setTimeout(() => {
    if (!session) redirect("/api/auth/signin");
  }, 1500);

  if (!session) {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to view your profile
          </h1>
        </div>
      </div>
    );
  }

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
                    src={session?.user?.ppUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-stone-800 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {session?.user?.firstName} {session?.user?.lastName}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  {session?.user?.email}
                </p>

                {/* Interests */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                    Interests
                  </h3>
                  {session?.user?.interests ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {session.user.interests.map(
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
                      {/* Add your actual stats here */}0
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Posts
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {/* Add your actual stats here */}0
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Followers
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-stone-800 transition-colors duration-200">
                Edit Profile
              </button>
            </div>
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
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
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
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email status
                </dt>
                <dd className="text-sm text-green-600 dark:text-green-400">
                  Verified
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
