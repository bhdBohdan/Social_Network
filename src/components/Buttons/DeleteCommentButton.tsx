"use client";

export default function DeleteCommentButton({
  commentId,
  onDeleted,
}: {
  commentId: string;
  onDeleted?: () => void;
}) {
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      onDeleted?.();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white rounded px-2 py-1 text-xs hover:bg-red-700 transition-colors"
    >
      Delete
    </button>
  );
}
