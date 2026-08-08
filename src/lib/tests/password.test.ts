import {
  describe,
  expect,
  it
} from "vitest";

import {
  hashPassword,
  verifyPassword
} from "../password";


describe("Password", () => {


  it("deve gerar um hash diferente da senha original", async () => {

    const password =
      "SenhaSegura123";


    const hash =
      await hashPassword(
        password
      );


    expect(hash)
      .not
      .toBe(password);


    expect(hash)
      .toBeTypeOf("string");

  });


  it("deve validar uma senha correta", async () => {

    const password =
      "SenhaSegura123";


    const hash =
      await hashPassword(
        password
      );


    const result =
      await verifyPassword(
        password,
        hash
      );


    expect(result)
      .toBe(true);

  });


  it("deve rejeitar uma senha incorreta", async () => {

    const password =
      "SenhaSegura123";


    const hash =
      await hashPassword(
        password
      );


    const result =
      await verifyPassword(
        "SenhaErrada123",
        hash
      );


    expect(result)
      .toBe(false);

  });


});