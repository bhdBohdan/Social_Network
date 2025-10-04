"use client";

import { useEffect, useState } from "react";

import { Post } from "@/common/interfaces/Post.interface";
import PostItem from "./PostItem";
import { Skeleton } from "./Skeleton";

export default function PostsList({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch("/api/posts", { cache: "no-store" });
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return loading ? (
    <Skeleton />
  ) : (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostItem
          post={post}
          userId={userId}
          fetchPosts={fetchPosts}
          key={post._id}
        />
      ))}
    </div>
  );
}
