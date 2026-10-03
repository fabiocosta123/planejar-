import { describe, expect, it } from "vitest";

import {
  accountTypeLabel,
  isAccountType,
} from "../account-type-label";

describe("tipo da conta", () => {
  it("nomeia os tipos em português", () => {
    expect(accountTypeLabel("CHECKING")).toBe("Conta corrente");
    expect(accountTypeLabel("SAVINGS")).toBe("Poupança");
    expect(accountTypeLabel("CASH")).toBe("Carteira");
    expect(accountTypeLabel("INVESTMENT")).toBe("Investimento");
    expect(accountTypeLabel("OTHER")).toBe("Outra");
  });

  it("reconhece só os tipos do domínio", () => {
    expect(isAccountType("CASH")).toBe(true);
    expect(isAccountType("CREDIT")).toBe(false);
  });
});
