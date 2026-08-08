import { describe, expect, it, vi, beforeEach } from "vitest";
import { AccountsRepository } from "../accounts.repository";
import { prisma } from "../../lib/prisma";


vi.mock("../../lib/prisma", () => ({

    prisma: {

        account: {

            findUnique: vi.fn(),

            findMany: vi.fn(),

            create: vi.fn(),

        }

    }

}));


describe("AccountsRepository", () => {


    const repository =
        new AccountsRepository();



    beforeEach(() => {

        vi.clearAllMocks();

    });



    it("deve buscar conta por id", async () => {


        const accountMock = {

            id: "account-1",

            name: "Nubank",

            type: "CHECKING",

            initialBalance: 1000

        };


        vi.mocked(
            prisma.account.findUnique
        )
        .mockResolvedValue(
            accountMock as any
        );



        const result =
            await repository.findById(
                "account-1"
            );



        expect(
            prisma.account.findUnique
        )
        .toHaveBeenCalledWith({

            where: {

                id: "account-1"

            }

        });



        expect(result)
            .toEqual(accountMock);


    });




    it("deve buscar contas do membro da família", async () => {


        const accountsMock = [

            {

                id: "1",

                name: "Carteira",

                type: "CASH",

                initialBalance: 500

            },

            {

                id: "2",

                name: "Banco",

                type: "CHECKING",

                initialBalance: 1500

            }

        ];



        vi.mocked(
            prisma.account.findMany
        )
        .mockResolvedValue(
            accountsMock as any
        );



        const result =
            await repository.findByFamilyMember(
                "member-1"
            );



        expect(
            prisma.account.findMany
        )
        .toHaveBeenCalledWith({

            where: {

                familyMemberId: "member-1"

            },

            orderBy: {

                displayOrder: "asc"

            }

        });



        expect(result)
            .toEqual(accountsMock);


    });




    it("deve criar uma conta", async () => {


        const data = {

            familyMemberId: "member-1",

            name: "Inter",

            type: "CHECKING" as const,

            initialBalanceDate:
                new Date(),

            initialBalance: 500

        };



        const createdAccount = {

            id: "account-10",

            ...data

        };



        vi.mocked(
            prisma.account.create
        )
        .mockResolvedValue(
            createdAccount as any
        );



        const result =
            await repository.create(
                data
            );



        expect(
            prisma.account.create
        )
        .toHaveBeenCalledWith({

            data: {

                name: "Inter",

                type: "CHECKING",

                initialBalanceDate:
                    data.initialBalanceDate,

                initialBalance: 500,

                familyMember: {

                    connect: {

                        id: "member-1"

                    }

                }

            }

        });



        expect(result)
            .toEqual(createdAccount);


    });


});