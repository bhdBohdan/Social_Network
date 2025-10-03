"use client";

import { use } from "react";
import PostDetails from "@/components/PostDetails";
import { Provider } from "@/components/Provider";

export default function PostDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // unwrap the params promise
  const { id } = use(params);

  return (
    <div className="p-4 m-4">
      <Provider>
        <PostDetails id={id} />
      </Provider>
    </div>
  );
}
