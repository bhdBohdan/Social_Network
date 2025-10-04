import { authOptions } from "@/common/auth-options";
import UsersList from "@/components/Lists/UserList";
import { getServerSession } from "next-auth";

export default async function Users() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-5 m-5">
      <UsersList userId={session?.user.id} />
    </div>
  );
}
