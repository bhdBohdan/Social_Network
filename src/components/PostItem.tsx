"use client";

import { Post } from "@/common/interfaces/Post.interface";
import ReactionButton from "./ReactionButton";
import Link from "next/link";
import DeletePostButton from "./DeletePostButton";

type ItemProps = {
  post: Post;
  userId: string;
  fetchPosts: () => void;
};

export default function PostItem({ post, userId, fetchPosts }: ItemProps) {
  return (
    <div
      key={post._id}
      className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-2xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-stone-900/50 transition-all duration-300 hover:border-gray-300 dark:hover:border-stone-600"
    >
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-stone-700">
        {post.author.ppUrl ? (
          <img
            className="w-8 h-8 rounded-full border border-gray-200 dark:border-stone-600"
            src={post.author.ppUrl}
            alt={`${post.author.firstName} ${post.author.lastName}`}
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-stone-600 dark:from-blue-600 dark:to-stone-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {post.author.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-stone-200">
            {post.author.firstName} {post.author.lastName}
          </p>
          <p className="text-xs text-gray-500 dark:text-stone-400">
            {/* {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })} */}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 dark:text-stone-200 text-lg leading-relaxed mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Actions Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ReactionButton
            postId={post._id}
            userId={userId}
            reactionsCount={post.reactions.length}
            onReacted={fetchPosts}
          />
        </div>

        {/* Author Actions */}
        {post.author._id === userId && (
          <div className="flex items-center gap-2">
            <Link
              href={`/posts/${post._id}/edit`}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-stone-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </Link>

            <DeletePostButton postId={post._id} onDeleted={fetchPosts} />
          </div>
        )}
      </div>
    </div>
  );
}
