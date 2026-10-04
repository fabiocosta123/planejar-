import { describe, expect, it, vi, beforeEach } from "vitest";

import { familyRepository } from "../family.repository";
import { prisma } from "../../lib/prisma";

describe("FamilyRepository", () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });


  it("deve buscar família pelo id", async () => {

    const family = {
      id: "family-1",
      name: "Família Silva",
      ownerId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      prisma.family,
      "findUnique"
    ).mockResolvedValue(
      family as any
    );


    const result =
      await familyRepository.findById(
        "family-1"
      );


    expect(
      prisma.family.findUnique
    ).toHaveBeenCalledWith({
      where: {
        id: "family-1"
      }
    });


    expect(result)
      .toEqual(family);

  });


  it("deve buscar famílias pelo proprietário", async () => {

    const families = [
      {
        id: "family-1",
        name: "Família Silva",
        ownerId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      },
      {
        id: "family-2",
        name: "Família Costa",
        ownerId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ];


    vi.spyOn(
      prisma.family,
      "findMany"
    ).mockResolvedValue(
      families as any
    );


    const result =
      await familyRepository.findByOwnerId(
        "user-1"
      );


    expect(
      prisma.family.findMany
    ).toHaveBeenCalledWith({

      where: {
        ownerId: "user-1",
        deletedAt: null
      },

      orderBy: {
        createdAt: "asc"
      }

    });


    expect(result)
      .toEqual(families);

  });


  it("deve criar uma família", async () => {

    const family = {
      id: "family-1",
      name: "Família Silva",
      ownerId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      prisma.family,
      "create"
    ).mockResolvedValue(
      family as any
    );


    const result =
      await familyRepository.create({

        name: "Família Silva",

        ownerId: "user-1"

      });


    expect(
      prisma.family.create
    ).toHaveBeenCalledWith({

      data: {

        name: "Família Silva",

        ownerId: "user-1"

      }

    });


    expect(result)
      .toEqual(family);

  });


  it("deve atualizar o nome da família", async () => {

    const family = {
      id: "family-1",
      name: "Família Silva Atualizada",
      ownerId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      prisma.family,
      "update"
    ).mockResolvedValue(
      family as any
    );


    const result =
      await familyRepository.update(
        "family-1",
        {
          name: "Família Silva Atualizada"
        }
      );


    expect(
      prisma.family.update
    ).toHaveBeenCalledWith({

      where: {
        id: "family-1"
      },

      data: {
        name: "Família Silva Atualizada"
      }

    });


    expect(result)
      .toEqual(family);

  });


  it("deve excluir logicamente uma família", async () => {

    const deletedAt =
      new Date();


    const family = {
      id: "family-1",
      name: "Família Silva",
      ownerId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt
    };


    vi.spyOn(
      prisma.family,
      "update"
    ).mockResolvedValue(
      family as any
    );


    const result =
      await familyRepository.delete(
        "family-1"
      );


    expect(
      prisma.family.update
    ).toHaveBeenCalledWith({

      where: {
        id: "family-1"
      },

      data: {
        deletedAt: expect.any(Date)
      }

    });


    expect(result)
      .toEqual(family);

  });

});