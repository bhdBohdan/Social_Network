"use client";

import { useEffect, useState } from "react";
import DeletePostButton from "./DeletePostButton";
import EditPostForm from "./EditPostForm";
import ReactionButton from "./ReactionButton";
import Link from "next/link";

type Post = {
  _id: string;
  content: string;
  author: { _id: string; name: string };
  reactions: { user: { _id: string }; type: string }[];
};

export default function PostsList({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);

  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <div key={post._id} className="p-4 border rounded-lg shadow-sm">
          <p className="text-gray-800">{post.content}</p>
          <p className="text-xs text-gray-500">by {post.author.name}</p>
          <div className="flex gap-2 mt-2">
            <ReactionButton
              postId={post._id}
              userId={userId}
              reactionsCount={post.reactions.length}
              onReacted={fetchPosts}
            />
            {post.author._id === userId && (
              <>
                <Link href={`/posts/${post._id}/edit`}>Edit</Link>

                <DeletePostButton postId={post._id} onDeleted={fetchPosts} />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
