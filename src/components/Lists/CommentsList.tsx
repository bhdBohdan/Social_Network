"use client";

import { useEffect, useState } from "react";
import ReactionButton from "../Buttons/ReactionButton";
import Link from "next/link";
import { Comment } from "@/common/interfaces/Comment.interface";
import CommentItem from "../Items/CommentsItem";
import CommentAddForm from "../Forms/AddCommentForm";
import { Skeleton } from "../Skeleton";

// Props
interface CommentsListProps {
  postId: string; // comments belong to a post
  userId?: string; // logged-in user
}

export default function CommentsList({ postId, userId }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchComments() {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?postId=${postId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <>
      <CommentAddForm
        postId={postId}
        userId={userId || ""}
        onAdded={fetchComments}
      />
      {loading && (
        <div className="flex flex-col gap-3 p-9 m-3">
          <Skeleton />
        </div>
      )}
      {!loading && !comments.length ? (
        <p className="text-gray-500">No comments yet</p>
      ) : (
        <div className="flex flex-col gap-3 p-9 m-3">
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              fetchComments={fetchComments}
              userId={userId || ""}
            />
          ))}
        </div>
      )}
    </>
  );
}
