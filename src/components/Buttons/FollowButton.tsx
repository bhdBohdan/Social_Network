"use client";

import { useState } from "react";

interface FollowButtonProps {
  userId: string; // target user to follow/unfollow
  currentUserId: string; // logged-in user
  isFollowing: boolean; // initial state
}

export default function FollowButton({
  userId,
  currentUserId,
  isFollowing,
}: FollowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  async function handleFollowUnfollow() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId }),
      });

      if (!res.ok) throw new Error("Failed to follow/unfollow");

      const data = await res.json();
      setFollowing(!following); // toggle state
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollowUnfollow}
      disabled={loading}
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white 
      bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
      dark:focus:ring-offset-stone-800 transition-colors duration-200 disabled:opacity-50"
    >
      {loading ? "..." : following ? "Unfollow" : "Follow"}
    </button>
  );
}
