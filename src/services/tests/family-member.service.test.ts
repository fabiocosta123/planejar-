import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  familyMemberService
} from "../family-member.service";

import {
  familyMemberRepository
} from "../../repositories/family-member.repository";


describe("FamilyMemberService", () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });


  it("deve buscar membro pelo id", async () => {

    const member = {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "MEMBER",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      familyMemberRepository,
      "findById"
    ).mockResolvedValue(
      member as any
    );


    const result =
      await familyMemberService.findById(
        "member-1"
      );


    expect(
      familyMemberRepository.findById
    ).toHaveBeenCalledWith(
      "member-1"
    );


    expect(result)
      .toEqual(member);

  });


  it("deve retornar null quando o membro não existir", async () => {

    vi.spyOn(
      familyMemberRepository,
      "findById"
    ).mockResolvedValue(null);


    const result =
      await familyMemberService.findById(
        "member-inexistente"
      );


    expect(result)
      .toBeNull();

  });


  it("deve listar membros do usuário", async () => {

    const members = [
      {
        id: "member-1",
        familyId: "family-1",
        userId: "user-1",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },

      {
        id: "member-2",
        familyId: "family-2",
        userId: "user-1",
        role: "MEMBER",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ];


    vi.spyOn(
      familyMemberRepository,
      "findByUserId"
    ).mockResolvedValue(
      members as any
    );


    const result =
      await familyMemberService.findByUserId(
        "user-1"
      );


    expect(
      familyMemberRepository.findByUserId
    ).toHaveBeenCalledWith(
      "user-1"
    );


    expect(result)
      .toEqual(members);

  });


  it("deve listar membros da família", async () => {

    const members = [
      {
        id: "member-1",
        familyId: "family-1",
        userId: "user-1",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },

      {
        id: "member-2",
        familyId: "family-1",
        userId: "user-2",
        role: "MEMBER",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ];


    vi.spyOn(
      familyMemberRepository,
      "findByFamilyId"
    ).mockResolvedValue(
      members as any
    );


    const result =
      await familyMemberService.findByFamilyId(
        "family-1"
      );


    expect(result)
      .toEqual(members);

  });


  it("não deve criar vínculo duplicado", async () => {

    const member = {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "MEMBER",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      familyMemberRepository,
      "findByFamilyAndUser"
    ).mockResolvedValue(
      member as any
    );


    const createSpy =
      vi.spyOn(
        familyMemberRepository,
        "create"
      );


    const result =
      await familyMemberService.create({

        familyId: "family-1",

        userId: "user-1",

        role: "MEMBER"

      });


    expect(createSpy)
      .not.toHaveBeenCalled();


    expect(result)
      .toEqual(member);

  });


  it("deve criar um membro", async () => {

    const member = {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "MEMBER",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      familyMemberRepository,
      "findByFamilyAndUser"
    ).mockResolvedValue(null);


    vi.spyOn(
      familyMemberRepository,
      "create"
    ).mockResolvedValue(
      member as any
    );


    const result =
      await familyMemberService.create({

        familyId: "family-1",

        userId: "user-1",

        role: "MEMBER"

      });


    expect(
      familyMemberRepository.create
    ).toHaveBeenCalledWith({

      familyId: "family-1",

      userId: "user-1",

      role: "MEMBER"

    });


    expect(result)
      .toEqual(member);

  });


  it("deve atualizar o role do membro", async () => {

    const member = {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "MEMBER",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      familyMemberRepository,
      "findById"
    ).mockResolvedValue(
      member as any
    );


    vi.spyOn(
      familyMemberRepository,
      "updateRole"
    ).mockResolvedValue(
      member as any
    );


    const result =
      await familyMemberService.updateRole(
        "member-1",
        "MEMBER"
      );


    expect(result)
      .toEqual(member);

  });


  it("deve retornar null ao atualizar membro inexistente", async () => {

    vi.spyOn(
      familyMemberRepository,
      "findById"
    ).mockResolvedValue(null);


    const result =
      await familyMemberService.updateRole(
        "member-inexistente",
        "MEMBER"
      );


    expect(result)
      .toBeNull();

  });


  it("deve excluir logicamente um membro", async () => {

    const member = {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "MEMBER",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    };


    vi.spyOn(
      familyMemberRepository,
      "findById"
    ).mockResolvedValue(
      member as any
    );


    vi.spyOn(
      familyMemberRepository,
      "delete"
    ).mockResolvedValue(
      member as any
    );


    const result =
      await familyMemberService.delete(
        "member-1"
      );


    expect(result)
      .toEqual(member);

  });

});