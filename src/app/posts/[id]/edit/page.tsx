import { getPostById } from "@/common/mongoDB/post";
import EditPostForm from "@/components/Forms/EditPostForm";
import { redirect } from "next/navigation";

export default async function EditPostPage({ params }: { params: any }) {
  const post = await getPostById(params.id);
  if (!post) return <p>Post not found</p>;

  return (
    <EditPostForm postId={post._id.toString()} initialContent={post.content} />
  );
}
