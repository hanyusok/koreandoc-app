"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "admin") {
    throw new Error("Unauthorized: Admin privileges required.");
  }
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const role = formData.get("role")?.toString() || "user";

  if (!email) throw new Error("이메일은 필수 입력 항목입니다.");

  await prisma.user.create({
    data: {
      name,
      email,
      role,
    },
  });

  revalidatePath("/admin/users");
}

export async function updateUserRole(userId: string, currentRole: string) {
  await requireAdmin();

  const newRole = currentRole === "admin" ? "user" : "admin";

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await requireAdmin();

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
}
