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
interface DynamoDBCommentsResponse {
  post: Record<string, any> | undefined; // Основний елемент поста (PK: POST#<ID>, SK: POST)
  comments: Record<string, any>[] | undefined; // Масив коментарів (PK: POST#<ID>, SK: COMMENT#<TS>)
  count: number | undefined;
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

      const data: DynamoDBCommentsResponse = await res.json();

      const fetchedComments = data.comments
        ? data.comments.map(
            (item) =>
              ({
                _id: item.CommentId,
                content: item.Content,

                ...item, // Розгортаємо інші поля, сподіваючись на сумісність
              } as Comment)
          )
        : [];

      setComments(fetchedComments);
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
        // Після додавання коментаря, оновлюємо список
        onAdded={fetchComments}
      />
      {/* ... (Ваш код рендерингу завантаження/скелетона) ... */}
      {loading && (
        <div className="flex flex-col gap-3 p-9 m-3">
          <Skeleton />
        </div>
      )}
      {/* Перевіряємо довжину масиву comments */}
      {!loading && !comments.length ? (
        <p className="text-gray-500">No comments yet</p>
      ) : (
        <div className="flex flex-col gap-3 p-9 m-3">
          {comments.map((comment) => (
            <CommentItem
              // Використовуйте унікальний ключ з DynamoDB. Якщо це CommentId, то використовуйте його.
              // Якщо ви використовуєте CommentSK (PK+SK), це найнадійніше.
              //key={comment.PK + '#' + comment.SK}
              key={comment._id.toString()}
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
