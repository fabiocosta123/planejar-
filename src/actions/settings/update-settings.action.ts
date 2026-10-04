"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../lib/auth";
import { SettingsUpdateError } from "../../services/errors/settings-update.error";
import { settingsService } from "../../services/settings.service";

export async function updateSettingsAction(input: unknown) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false as const,
      error: { message: "Faça login para continuar." },
    };
  }

  try {
    await settingsService.updatePreferences(userId, input);
  } catch (error) {
    return {
      success: false as const,
      error: {
        message:
          error instanceof SettingsUpdateError
            ? error.message
            : "Não foi possível salvar as configurações.",
      },
    };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return { success: true as const };
}
