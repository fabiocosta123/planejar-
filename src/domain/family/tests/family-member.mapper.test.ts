import { describe, expect, it } from "vitest";

import {
  FamilyMemberMapper
} from "../mappers/family-member.mapper";

describe("FamilyMemberMapper", () => {

  it("deve converter dados para o domínio", () => {

    const data = {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "MEMBER",
      createdAt: new Date("2026-08-01"),
      updatedAt: new Date("2026-08-02"),
      deletedAt: null
    };


    const result =
      FamilyMemberMapper.toDomain(
        data
      );


    expect(result)
      .toEqual({
        id: "member-1",

        familyId: "family-1",

        userId: "user-1",

        role: "MEMBER",

        createdAt:
          new Date("2026-08-01"),

        updatedAt:
          new Date("2026-08-02"),

        deletedAt: null
      });

  });


  it("deve converter o domínio para contrato", () => {

    const member = {

      id: "member-1",

      familyId: "family-1",

      userId: "user-1",

      role: "OWNER" as const,

      createdAt:
        new Date("2026-08-01"),

      updatedAt:
        new Date("2026-08-02"),

      deletedAt: null

    };


    const result =
      FamilyMemberMapper.toContract(
        member
      );


    expect(result)
      .toEqual(member);

  });


  it("deve preservar membro excluído logicamente", () => {

    const deletedAt =
      new Date("2026-08-03");


    const data = {

      id: "member-1",

      familyId: "family-1",

      userId: "user-1",

      role: "MEMBER",

      createdAt:
        new Date("2026-08-01"),

      updatedAt:
        new Date("2026-08-02"),

      deletedAt

    };


    const result =
      FamilyMemberMapper.toDomain(
        data
      );


    expect(result.deletedAt)
      .toEqual(deletedAt);

  });

});