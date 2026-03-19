"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please log in.");
  }
  return session.user.id;
}

export async function updateAddress(usAddress: string) {
  const userId = await requireUserId();

  await prisma.user.update({
    where: { id: userId },
    data: { usAddress },
  });

  revalidatePath("/profile");
}

export async function updateMedicalHistory(data: {
  allergies: string;
  currentMeds: string;
  pastConditions: string;
}) {
  const userId = await requireUserId();

  await prisma.user.update({
    where: { id: userId },
    data: {
      allergies: data.allergies,
      currentMeds: data.currentMeds,
      pastConditions: data.pastConditions,
    },
  });

  revalidatePath("/profile");
}

export async function updatePreferences(data: {
  kakaoNotif: boolean;
  emailReport: boolean;
  promoUpdates: boolean;
}) {
  const userId = await requireUserId();

  await prisma.user.update({
    where: { id: userId },
    data: {
      kakaoNotif: data.kakaoNotif,
      emailReport: data.emailReport,
      promoUpdates: data.promoUpdates,
    },
  });

  revalidatePath("/profile");
}
