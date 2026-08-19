import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  familyService
} from "../family.service";

import {
  familyRepository
} from "../../repositories/family.repository";

import {
  familyMemberRepository
} from "../../repositories/family-member.repository";

import { userSettingsRepository } from "../../repositories/user-settings.repository";

import {
  prisma
} from "../../lib/prisma";


describe("FamilyService", () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });


  it("deve buscar uma família pelo id", async () => {

    const family = {

      id: "family-1",

      name: "Minha Família",

      ownerId: "user-1",

      createdAt: new Date(),

      updatedAt: new Date(),

      deletedAt: null

    };


    vi.spyOn(
      familyRepository,
      "findById"
    ).mockResolvedValue(
      family as any
    );


    const result =
      await familyService.findById(
        "family-1"
      );


    expect(
      familyRepository.findById
    ).toHaveBeenCalledWith(
      "family-1"
    );


    expect(result)
      .toEqual(family);

  });


  it("deve retornar null quando a família não existir", async () => {

    vi.spyOn(
      familyRepository,
      "findById"
    ).mockResolvedValue(null);


    const result =
      await familyService.findById(
        "family-inexistente"
      );


    expect(result)
      .toBeNull();

  });


  it("deve listar famílias do proprietário", async () => {

    const families = [

      {
        id: "family-1",

        name: "Família 1",

        ownerId: "user-1",

        createdAt: new Date(),

        updatedAt: new Date(),

        deletedAt: null
      },

      {
        id: "family-2",

        name: "Família 2",

        ownerId: "user-1",

        createdAt: new Date(),

        updatedAt: new Date(),

        deletedAt: null
      }

    ];


    vi.spyOn(
      familyRepository,
      "findByOwnerId"
    ).mockResolvedValue(
      families as any
    );


    const result =
      await familyService.findByOwnerId(
        "user-1"
      );


    expect(result)
      .toEqual(families);

  });


  it("deve criar uma família e seu proprietário atomicamente", async () => {

    const family = {

      id: "family-1",

      name: "Minha Família",

      ownerId: "user-1",

      createdAt: new Date(),

      updatedAt: new Date(),

      deletedAt: null

    };


    const owner = {

      id: "member-1",

      familyId: "family-1",

      userId: "user-1",

      role: "OWNER",

      createdAt: new Date(),

      updatedAt: new Date(),

      deletedAt: null

    };


    const createFamilySpy =
      vi.spyOn(
        familyRepository,
        "createWithClient"
      )
        .mockResolvedValue(
          family as any
        );


    const createOwnerSpy =
      vi.spyOn(
        familyMemberRepository,
        "createWithClient"
      )
        .mockResolvedValue(
          owner as any
        );


    const transactionClient = {
      family: {},
      familyMember: {},
      userSettings: {}
    } as any;

    const findSettingsSpy =
      vi.spyOn(
        userSettingsRepository,
        "findByUserIdWithClient"
      )
        .mockResolvedValue(
          null
        );


    const createSettingsSpy =
      vi.spyOn(
        userSettingsRepository,
        "createWithClient"
      )
        .mockResolvedValue(
          {
            id: "settings-1",
            userId: "user-1",
            currentFamilyId: null,
          } as any
        );


    const updateCurrentFamilySpy =
      vi.spyOn(
        userSettingsRepository,
        "updateCurrentFamilyWithClient"
      )
        .mockResolvedValue(
          {
            id: "settings-1",
            userId: "user-1",
            currentFamilyId: "family-1",
          } as any
        );


    const transactionSpy =
      vi.spyOn(
        prisma,
        "$transaction"
      )
        .mockImplementation(
          async (callback: any) => {

            return callback(
              transactionClient
            );

          }
        );


    const result =
      await familyService.create({

        name: "Minha Família",

        ownerId: "user-1"

      });


    expect(transactionSpy)
      .toHaveBeenCalled();


    expect(createFamilySpy)
      .toHaveBeenCalledWith(

        transactionClient,

        {
          name: "Minha Família",

          ownerId: "user-1"
        }

      );


    expect(createOwnerSpy)
      .toHaveBeenCalledWith(

        transactionClient,

        {
          familyId: "family-1",

          userId: "user-1",

          role: "OWNER"
        }

      );

    expect(findSettingsSpy)
      .toHaveBeenCalledWith(
        transactionClient,
        "user-1"
      );


    expect(createSettingsSpy)
      .toHaveBeenCalledWith(
        transactionClient,
        "user-1"
      );


    expect(updateCurrentFamilySpy)
      .toHaveBeenCalledWith(
        transactionClient,
        "user-1",
        "family-1"
      );


    expect(result.family)
      .toEqual(family);


    expect(result.owner)
      .toEqual(owner);

  });


  it("deve atualizar uma família", async () => {

    const family = {

      id: "family-1",

      name: "Família Antiga",

      ownerId: "user-1",

      createdAt: new Date(),

      updatedAt: new Date(),

      deletedAt: null

    };


    const updatedFamily = {

      ...family,

      name: "Família Nova"

    };


    vi.spyOn(
      familyRepository,
      "findById"
    ).mockResolvedValue(
      family as any
    );


    vi.spyOn(
      familyRepository,
      "update"
    ).mockResolvedValue(
      updatedFamily as any
    );


    const result =
      await familyService.update(

        "family-1",

        {
          name: "Família Nova"
        }

      );


    expect(result)
      .toEqual(updatedFamily);

  });


  it("deve retornar null ao atualizar família inexistente", async () => {

    vi.spyOn(
      familyRepository,
      "findById"
    ).mockResolvedValue(null);


    const result =
      await familyService.update(

        "family-inexistente",

        {
          name: "Nova"
        }

      );


    expect(result)
      .toBeNull();

  });


  it("deve excluir logicamente uma família", async () => {

    const family = {

      id: "family-1",

      name: "Minha Família",

      ownerId: "user-1",

      createdAt: new Date(),

      updatedAt: new Date(),

      deletedAt: new Date()

    };


    vi.spyOn(
      familyRepository,
      "findById"
    ).mockResolvedValue(
      family as any
    );


    vi.spyOn(
      familyRepository,
      "delete"
    ).mockResolvedValue(
      family as any
    );


    const result =
      await familyService.delete(
        "family-1"
      );


    expect(result)
      .toEqual(family);

  });


  it("deve retornar null ao excluir família inexistente", async () => {

    vi.spyOn(
      familyRepository,
      "findById"
    ).mockResolvedValue(null);


    const result =
      await familyService.delete(
        "family-inexistente"
      );


    expect(result)
      .toBeNull();

  });

});