import { describe, expect, it } from "vitest";

import { parseRegisterInput } from "../parse-register";

describe("parseRegisterInput", () => {
  it("aceita o usuário principal sem código", () => {
    const result = parseRegisterInput({
      name: "Fábio Silva",
      email: "Fabio@Email.com",
      password: "senha1234",
      principal: true,
    });

    expect(result).toEqual({
      ok: true,
      value: {
        name: "Fábio Silva",
        email: "fabio@email.com",
        password: "senha1234",
        principal: true,
        inviteCode: null,
      },
    });
  });

  it("exige o código de quem vai lançar no saldo de outra pessoa", () => {
    expect(
      parseRegisterInput({
        name: "Ana",
        email: "ana@email.com",
        password: "senha1234",
        principal: false,
        inviteCode: "ab",
      })
    ).toEqual({
      ok: false,
      message: "Informe o código da família do usuário principal.",
    });
  });

  it("normaliza o código da família", () => {
    const result = parseRegisterInput({
      name: "Ana",
      email: "ana@email.com",
      password: "senha1234",
      principal: false,
      inviteCode: "ab-12cd",
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        principal: false,
        inviteCode: "AB12CD",
      },
    });
  });
});
