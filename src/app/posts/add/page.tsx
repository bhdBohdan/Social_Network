import { authOptions } from "@/common/lib/auth-options";
import AddPostForm from "@/components/AddPostForm";
import { getServerSession } from "next-auth";

export default async function AddPostPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  return <AddPostForm userId={userId} />;
}
