import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { createTransactionAction } from "../create-transaction.action";
import { auth } from "../../../lib/auth";
import { transactionsService } from "../../../services/transactions.service";
import { TransactionCreateError } from "../../../services/errors/transaction-create.error";
import { revalidatePath } from "next/cache";

vi.mock("../../../lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("../../../services/transactions.service", () => ({
  transactionsService: {
    createForUser: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const input = {
  accountId: "account-1",
  description: "Mercado",
  amount: "10,00",
  type: "EXPENSE",
  transactionDate: "2026-08-20",
};

describe("createTransactionAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exigir sessão", async () => {
    vi.mocked(auth).mockResolvedValue(null as any);

    const result = await createTransactionAction(input);

    expect(result).toEqual({
      success: false,
      error: {
        message: "Faça login para continuar.",
      },
    });

    expect(transactionsService.createForUser).not.toHaveBeenCalled();
  });

  it("deve registrar o lançamento do usuário da sessão", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1" },
    } as any);

    vi.mocked(transactionsService.createForUser).mockResolvedValue({
      id: "transaction-1",
    } as any);

    const result = await createTransactionAction(input);

    expect(transactionsService.createForUser).toHaveBeenCalledWith(
      "user-1",
      input
    );

    expect(revalidatePath).toHaveBeenCalledWith("/transactions");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(result).toEqual({ success: true });
  });

  it("deve devolver a mensagem segura quando a criação é recusada", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1" },
    } as any);

    vi.mocked(transactionsService.createForUser).mockRejectedValue(
      new TransactionCreateError("Conta não encontrada.")
    );

    const result = await createTransactionAction(input);

    expect(result).toEqual({
      success: false,
      error: {
        message: "Conta não encontrada.",
      },
    });

    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("não deve expor erro interno", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1" },
    } as any);

    vi.mocked(transactionsService.createForUser).mockRejectedValue(
      new Error("saldo 5000 do usuário secreto")
    );

    const result = await createTransactionAction(input);

    expect(result).toEqual({
      success: false,
      error: {
        message: "Não foi possível registrar o lançamento.",
      },
    });
  });
});
