"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../lib/auth";
import { TransactionCreateError } from "../../services/errors/transaction-create.error";
import { transactionsService } from "../../services/transactions.service";

export async function stopSeriesAction(seriesId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false as const,
      error: {
        message: "Faça login para continuar.",
      },
    };
  }

  try {
    await transactionsService.stopSeriesForUser(userId, seriesId);
  } catch (error) {
    if (error instanceof TransactionCreateError) {
      return {
        success: false as const,
        error: {
          message: error.message,
        },
      };
    }

    return {
      success: false as const,
      error: {
        message: "Não foi possível encerrar a repetição.",
      },
    };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");

  return {
    success: true as const,
  };
}
