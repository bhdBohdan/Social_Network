"use client";

import { useState, FormEvent } from "react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

export default function CommentAddForm({
  userId,
  postId,
  onAdded, // callback to refresh post/comments list
}: {
  userId: string | null;
  postId: string;
  onAdded?: () => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!userId || userId === "") {
      router.push("/signin");
      return <></>;
    }

    if (!content.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: userId,
          post: postId,
          content,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add comment");
      }

      setContent(""); // clear textarea
      if (onAdded) onAdded(); // refresh comments in parent
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-gray-200 dark:border-stone-700 p-4 shadow-lg z-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 max-w-4xl mx-auto"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border border-gray-300 dark:border-stone-600 rounded-lg p-3 bg-white dark:bg-stone-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-stone-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[80px] disabled:opacity-50"
          disabled={loading}
          rows={3}
        />
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm px-1">{error}</p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </span>
            ) : (
              "Add Comment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
