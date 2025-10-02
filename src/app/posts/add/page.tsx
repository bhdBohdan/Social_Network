import { authOptions } from "@/common/auth-options";
import AddPostForm from "@/components/AddPostForm";
import { getServerSession } from "next-auth";

export default async function AddPostPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;

  return (
    <div className="p-14">
      <AddPostForm user={user} />
    </div>
  );
}
