import { describe, expect, it, vi, beforeEach } from "vitest";

import { userRepository } from "../user.repository";
import { prisma } from "../../lib/prisma";

describe("UserRepository", () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });


  it("deve buscar usuário pelo email", async () => {

    const user = {
      id: "user-1",
      name: "Fábio",
      email: "fabio@email.com",
      passwordHash: "hash",
      image: null,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    vi.spyOn(
      prisma.user,
      "findUnique"
    ).mockResolvedValue(
      user as any
    );


    const result =
      await userRepository.findByEmail(
        "fabio@email.com"
      );


    expect(
      prisma.user.findUnique
    ).toHaveBeenCalledWith({
      where: {
        email: "fabio@email.com"
      }
    });


    expect(result)
      .toEqual(user);

  });


  it("deve retornar null quando o email não existir", async () => {

    vi.spyOn(
      prisma.user,
      "findUnique"
    ).mockResolvedValue(null);


    const result =
      await userRepository.findByEmail(
        "naoexiste@email.com"
      );


    expect(result)
      .toBeNull();

  });


  it("deve buscar usuário pelo id", async () => {

    const user = {
      id: "user-1",
      name: "Fábio",
      email: "fabio@email.com",
      passwordHash: "hash",
      image: null,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    vi.spyOn(
      prisma.user,
      "findUnique"
    ).mockResolvedValue(
      user as any
    );


    const result =
      await userRepository.findById(
        "user-1"
      );


    expect(
      prisma.user.findUnique
    ).toHaveBeenCalledWith({
      where: {
        id: "user-1"
      }
    });


    expect(result)
      .toEqual(user);

  });


  it("deve criar um usuário", async () => {

    const user = {
      id: "user-1",
      name: "Fábio",
      email: "fabio@email.com",
      passwordHash: "hash",
      image: null,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };


    vi.spyOn(
      prisma.user,
      "create"
    ).mockResolvedValue(
      user as any
    );


    const result =
      await userRepository.create({

        name: "Fábio",

        email: "fabio@email.com",

        passwordHash: "hash"

      });


    expect(
      prisma.user.create
    ).toHaveBeenCalledWith({

      data: {

        name: "Fábio",

        email: "fabio@email.com",

        passwordHash: "hash"

      }

    });


    expect(result)
      .toEqual(user);

  });

});