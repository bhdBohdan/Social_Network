"use client";

import { useState, FormEvent } from "react";

export default function EditPostForm({
  postId,
  initialContent,
  onUpdated,
}: {
  postId: string;
  initialContent: string;
  onUpdated?: () => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to update post");
      onUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        rows={2}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-500 text-white rounded px-3 py-1 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
