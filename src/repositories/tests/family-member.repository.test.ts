import {
  describe,
  expect,
  it,
  vi,
  beforeEach
} from "vitest";

import {
  familyMemberRepository
} from "../family-member.repository";

import {
  prisma
} from "../../lib/prisma";


describe("FamilyMemberRepository", () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });


  it("deve buscar membro pelo id", async () => {

    const member = {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "OWNER",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      prisma.familyMember,
      "findUnique"
    ).mockResolvedValue(
      member as any
    );


    const result =
      await familyMemberRepository.findById(
        "member-1"
      );


    expect(
      prisma.familyMember.findUnique
    ).toHaveBeenCalledWith({

      where: {
        id: "member-1"
      }

    });


    expect(result)
      .toEqual(member);

  });


  it("deve buscar famílias do usuário", async () => {

    const members = [
      {
        id: "member-1",
        familyId: "family-1",
        userId: "user-1",
        role: "OWNER",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ];


    vi.spyOn(
      prisma.familyMember,
      "findMany"
    ).mockResolvedValue(
      members as any
    );


    const result =
      await familyMemberRepository.findByUserId(
        "user-1"
      );


    expect(
      prisma.familyMember.findMany
    ).toHaveBeenCalledWith({

      where: {
        userId: "user-1",
        deletedAt: null
      },

      orderBy: {
        createdAt: "asc"
      }

    });


    expect(result)
      .toEqual(members);

  });


  it("deve buscar membros da família", async () => {

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
      prisma.familyMember,
      "findMany"
    ).mockResolvedValue(
      members as any
    );


    const result =
      await familyMemberRepository.findByFamilyId(
        "family-1"
      );


    expect(
      prisma.familyMember.findMany
    ).toHaveBeenCalledWith({

      where: {
        familyId: "family-1",
        deletedAt: null
      },

      orderBy: {
        createdAt: "asc"
      }

    });


    expect(result)
      .toEqual(members);

  });


  it("deve buscar membro pela família e usuário", async () => {

    const member = {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "OWNER",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      prisma.familyMember,
      "findUnique"
    ).mockResolvedValue(
      member as any
    );


    const result =
      await familyMemberRepository.findByFamilyAndUser(
        "family-1",
        "user-1"
      );


    expect(
      prisma.familyMember.findUnique
    ).toHaveBeenCalledWith({

      where: {
        familyId_userId: {
          familyId: "family-1",
          userId: "user-1"
        }
      }

    });


    expect(result)
      .toEqual(member);

  });


  it("deve criar um membro", async () => {

    const member = {
      id: "member-1",
      familyId: "family-1",
      userId: "user-1",
      role: "OWNER",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      prisma.familyMember,
      "create"
    ).mockResolvedValue(
      member as any
    );


    const result =
      await familyMemberRepository.create({

        familyId: "family-1",

        userId: "user-1",

        role: "OWNER"

      });


    expect(
      prisma.familyMember.create
    ).toHaveBeenCalledWith({

      data: {

        familyId: "family-1",

        userId: "user-1",

        role: "OWNER"

      }

    });


    expect(result)
      .toEqual(member);

  });


  it("deve atualizar a função do membro", async () => {

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
      prisma.familyMember,
      "update"
    ).mockResolvedValue(
      member as any
    );


    const result =
      await familyMemberRepository.updateRole(
        "member-1",
        "MEMBER"
      );


    expect(
      prisma.familyMember.update
    ).toHaveBeenCalledWith({

      where: {
        id: "member-1"
      },

      data: {
        role: "MEMBER"
      }

    });


    expect(result)
      .toEqual(member);

  });


  it("deve excluir logicamente o membro", async () => {

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
      prisma.familyMember,
      "update"
    ).mockResolvedValue(
      member as any
    );


    const result =
      await familyMemberRepository.delete(
        "member-1"
      );


    expect(
      prisma.familyMember.update
    ).toHaveBeenCalledWith({

      where: {
        id: "member-1"
      },

      data: {
        deletedAt: expect.any(Date)
      }

    });


    expect(result)
      .toEqual(member);

  });

});