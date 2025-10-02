"use client";

export default function DeletePostButton({
  postId,
  onDeleted,
}: {
  postId: string;
  onDeleted?: () => void;
}) {
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      onDeleted?.();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700"
    >
      Delete
    </button>
  );
}
