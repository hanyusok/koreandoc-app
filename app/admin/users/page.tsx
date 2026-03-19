import { prisma } from "@/lib/prisma";
import UserTableManager from "./UserTableManager";

export default async function AdminUsersPage() {
  // Fetch users server-side securely
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
  });

  return <UserTableManager initialUsers={users} />;
}
