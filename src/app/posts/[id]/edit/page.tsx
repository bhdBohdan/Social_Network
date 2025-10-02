import { getPostById } from "@/common/lib/post";
import EditPostForm from "@/components/EditPostForm";
import { redirect } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPostById(params.id);
  if (!post) return <p>Post not found</p>;

  return (
    <EditPostForm
      postId={post._id.toString()}
      initialContent={post.content}
      onUpdated={() => {
        redirect(`/posts/${post._id.toString()}`);
      }}
    />
  );
}
