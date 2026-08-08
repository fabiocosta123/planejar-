import {
  describe,
  expect,
  it,
  vi,
  beforeEach
} from "vitest";

import { usersService } from "../users.service";
import { userRepository } from "../../repositories/user.repository";


describe("UsersService", () => {


  beforeEach(() => {

    vi.restoreAllMocks();

  });


  it("deve buscar usuário pelo email", async () => {

    const user = {
      id: "user-1",
      name: "Fábio",
      email: "fabio@email.com",
      passwordHash: "hash",
      status: "ACTIVE"
    };


    vi.spyOn(
      userRepository,
      "findByEmail"
    ).mockResolvedValue(
      user as any
    );


    const result =
      await usersService.findByEmail(
        "fabio@email.com"
      );


    expect(
      userRepository.findByEmail
    ).toHaveBeenCalledWith(
      "fabio@email.com"
    );


    expect(result)
      .toEqual(user);

  });


  it("deve buscar usuário pelo id", async () => {

    const user = {
      id: "user-1",
      name: "Fábio",
      email: "fabio@email.com",
      passwordHash: "hash",
      status: "ACTIVE"
    };


    vi.spyOn(
      userRepository,
      "findById"
    ).mockResolvedValue(
      user as any
    );


    const result =
      await usersService.findById(
        "user-1"
      );


    expect(
      userRepository.findById
    ).toHaveBeenCalledWith(
      "user-1"
    );


    expect(result)
      .toEqual(user);

  });


  it("deve criar usuário", async () => {

    const user = {
      id: "user-1",
      name: "Fábio",
      email: "fabio@email.com",
      passwordHash: "hash",
      status: "ACTIVE"
    };


    vi.spyOn(
      userRepository,
      "create"
    ).mockResolvedValue(
      user as any
    );


    const result =
      await usersService.create({

        name: "Fábio",

        email: "fabio@email.com",

        passwordHash: "hash"

      });


    expect(
      userRepository.create
    ).toHaveBeenCalledWith({

      name: "Fábio",

      email: "fabio@email.com",

      passwordHash: "hash"

    });


    expect(result)
      .toEqual(user);

  });


});