import {
  describe,
  expect,
  it
} from "vitest";

import {
  FamilyMapper
} from "../mappers/family.mapper";


describe("FamilyMapper", () => {

  it("deve converter dados para o domínio", () => {

    const data = {

      id: "family-1",

      name: "Minha Família",

      ownerId: "user-1",

      createdAt:
        new Date("2026-08-01"),

      updatedAt:
        new Date("2026-08-02"),

      deletedAt: null

    };


    const result =
      FamilyMapper.toDomain(
        data
      );


    expect(result)
      .toEqual(data);

  });


  it("deve converter o domínio para contrato", () => {

    const family = {

      id: "family-1",

      name: "Minha Família",

      ownerId: "user-1",

      createdAt:
        new Date("2026-08-01"),

      updatedAt:
        new Date("2026-08-02"),

      deletedAt: null

    };


    const result =
      FamilyMapper.toContract(
        family
      );


    expect(result)
      .toEqual(family);

  });


  it("deve preservar uma família excluída logicamente", () => {

    const deletedAt =
      new Date("2026-08-03");


    const family = {

      id: "family-1",

      name: "Minha Família",

      ownerId: "user-1",

      createdAt:
        new Date("2026-08-01"),

      updatedAt:
        new Date("2026-08-02"),

      deletedAt

    };


    const result =
      FamilyMapper.toDomain(
        family
      );


    expect(result.deletedAt)
      .toEqual(deletedAt);

  });

});