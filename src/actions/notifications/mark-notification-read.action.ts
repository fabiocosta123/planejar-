"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../lib/auth";
import { notificationsService } from "../../services/notifications.service";

export async function markNotificationReadAction(notificationId: unknown) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false as const,
      error: { message: "Faça login para continuar." },
    };
  }

  if (typeof notificationId !== "string" || notificationId.length === 0) {
    return {
      success: false as const,
      error: { message: "Aviso não encontrado." },
    };
  }

  await notificationsService.markReadForUser(userId, notificationId);
  revalidatePath("/dashboard");

  return { success: true as const };
}
