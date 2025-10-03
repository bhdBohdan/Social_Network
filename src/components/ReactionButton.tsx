"use client";

import { useState } from "react";

export default function ReactionButton({
  targetId,
  userId,
  reactionsCount,
  type, // "post" | "comment"
  onReacted,
}: {
  targetId: string;
  userId: string;
  reactionsCount: number;
  type: "post" | "comment";
  onReacted?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function toggleReaction() {
    setLoading(true);
    try {
      const res = await fetch(`/api/${type}s/${targetId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: "like" }),
      });
      if (!res.ok) throw new Error("Failed to react");
      onReacted?.();
    } catch (err) {
      console.error(err);
      window.alert("You are not signed in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleReaction}
      disabled={loading}
      className="bg-gray-200 text-black dark:text-white dark:bg-gray-800 rounded px-2 py-1 text-sm hover:bg-gray-300 dark:hover:bg-gray-900 disabled:opacity-50"
    >
      👍 {reactionsCount}
    </button>
  );
}
