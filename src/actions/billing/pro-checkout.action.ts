"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../lib/auth";
import { ProCheckoutError } from "../../services/pro-checkout.service";
import { proCheckoutService } from "../../services/pro-checkout.service";

async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return userId;
}

function failure(message: string) {
  return {
    success: false as const,
    error: { message },
  };
}

export async function startProCheckoutAction() {
  const userId = await requireUserId();

  if (!userId) {
    return failure("Faça login para continuar.");
  }

  try {
    const result = await proCheckoutService.startCheckout(userId);

    if (result.kind === "already-pro") {
      revalidatePath("/dashboard");
      revalidatePath("/transactions");
    }

    return {
      success: true as const,
      result,
    };
  } catch (error) {
    if (error instanceof ProCheckoutError) {
      return failure(error.message);
    }

    return failure("Não foi possível gerar o PIX.");
  }
}

export async function confirmProPaymentAction(idFaturaPag: string) {
  const userId = await requireUserId();

  if (!userId) {
    return failure("Faça login para continuar.");
  }

  try {
    const result = await proCheckoutService.confirm(userId, idFaturaPag);

    if (result.kind === "paid") {
      revalidatePath("/dashboard");
      revalidatePath("/transactions");
    }

    return {
      success: true as const,
      result,
    };
  } catch (error) {
    if (error instanceof ProCheckoutError) {
      return failure(error.message);
    }

    return failure("Não foi possível consultar o PIX.");
  }
}

export async function simulateProPaymentAction(idFaturaPag: string) {
  const userId = await requireUserId();

  if (!userId) {
    return failure("Faça login para continuar.");
  }

  try {
    const result = await proCheckoutService.simulate(userId, idFaturaPag);

    if (result.kind === "paid") {
      revalidatePath("/dashboard");
      revalidatePath("/transactions");
    }

    return {
      success: true as const,
      result,
    };
  } catch (error) {
    if (error instanceof ProCheckoutError) {
      return failure(error.message);
    }

    return failure("Não foi possível simular o pagamento.");
  }
}
