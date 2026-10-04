"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../lib/auth";
import { AccountWriteError } from "../../services/errors/account-write.error";
import { accountsService } from "../../services/accounts.service";

export async function createLedgerAccountAction(input: unknown) {
  const userId = await currentUserId();

  if (!userId) {
    return {
      success: false as const,
      error: { message: "Faça login para continuar." },
    };
  }

  try {
    await accountsService.createForUser(userId, input);
  } catch (error) {
    return {
      success: false as const,
      error: {
        message:
          error instanceof AccountWriteError
            ? error.message
            : "Não foi possível criar a conta.",
      },
    };
  }

  revalidatePath("/accounts");
  revalidatePath("/transactions");

  return { success: true as const };
}

export async function setDefaultAccountAction(accountId: unknown) {
  const userId = await currentUserId();

  if (!userId) {
    return {
      success: false as const,
      error: { message: "Faça login para continuar." },
    };
  }

  try {
    await accountsService.setDefaultForUser(userId, accountId);
  } catch (error) {
    return {
      success: false as const,
      error: {
        message:
          error instanceof AccountWriteError
            ? error.message
            : "Não foi possível definir a conta padrão.",
      },
    };
  }

  revalidatePath("/accounts");
  revalidatePath("/transactions");

  return { success: true as const };
}

async function currentUserId() {
  const session = await auth();
  return session?.user?.id;
}
