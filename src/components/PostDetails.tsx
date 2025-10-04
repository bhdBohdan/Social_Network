"use client";

import { Post } from "@/common/interfaces/Post.interface";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CommentsList from "@/components/Lists/CommentsList";
import { Skeleton } from "./Skeleton";
import PostItem from "./Items/PostItem";

export default function PostDetails({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  // Get current session
  const { data: session, status } = useSession();

  async function fetchPost() {
    setLoading(true);
    const res = await fetch(`/api/posts/${id}`, { cache: "no-store" });
    const data = await res.json();
    setPost(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPost();
  }, []);

  if (loading)
    return (
      <div>
        <Skeleton num={1} />
      </div>
    );

  if (!post) return <div>Post not found</div>;

  return (
    <div className="pb-50">
      <PostItem
        fetchPosts={fetchPost}
        post={post}
        userId={session?.user.id || ""}
      />

      <CommentsList postId={post._id} userId={session?.user.id} />
    </div>
  );
}
