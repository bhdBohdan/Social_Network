"use client";

import { usePathname, useRouter } from "next/navigation";

export default function DeletePostButton({
  postId,
  onDeleted,
}: {
  postId: string;
  onDeleted?: () => void;
}) {
  const path = usePathname();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");

      console.log(path.split("?")[0]);
      console.log(path);

      if (path === "/") {
        onDeleted?.();
      } else {
        router.push("/");
      }
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
