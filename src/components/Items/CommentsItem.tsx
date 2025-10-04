"use client";

import { useState } from "react";
import { Comment } from "@/common/interfaces/Comment.interface";
import ReactionButton from "../Buttons/ReactionButton";
import DeleteCommentButton from "../Buttons/DeleteCommentButton";
import Link from "next/link";

type CommentItemProps = {
  comment: Comment;
  userId: string;
  fetchComments: () => void;
};

export default function CommentItem({
  comment,
  userId,
  fetchComments,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/comments/${comment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to update comment");

      await fetchComments();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Could not save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      key={comment._id.toString()}
      className="bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl p-3 shadow-sm hover:shadow-md dark:hover:shadow-stone-900/40 transition-all duration-300"
    >
      {/* Author Info */}
      <div className="flex items-center gap-2 mb-2">
        {comment.author.ppUrl ? (
          <img
            className="w-6 h-6 rounded-full border border-gray-200 dark:border-stone-600"
            src={comment.author.ppUrl}
            alt={`${comment.author.firstName} ${comment.author.lastName}`}
          />
        ) : (
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-stone-600 dark:from-blue-600 dark:to-stone-700 rounded-full flex items-center justify-center text-white text-[10px] font-semibold">
            {comment.author.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <Link
          href={`/profile/${comment.author._id}`}
          className="text-xs font-medium text-gray-700 dark:text-stone-200 hover:underline"
        >
          {comment.author.firstName} {comment.author.lastName}
        </Link>
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <textarea
          className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
      ) : (
        <p className="text-gray-800 dark:text-stone-200 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
          {comment.content}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-2">
        {/* <ReactionButton ... /> */}
        <ReactionButton
          targetId={comment._id.toString()}
          userId={userId}
          reactionsCount={comment.reactions.length}
          onReacted={fetchComments}
          type="comment"
        />

        {comment.author._id === userId && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-2 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setContent(comment.content);
                  }}
                  className="px-2 py-1 text-xs text-gray-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-2 py-1 text-xs text-gray-600 dark:text-stone-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition"
                >
                  Edit
                </button>
                <DeleteCommentButton
                  commentId={comment._id.toString()}
                  onDeleted={fetchComments}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
