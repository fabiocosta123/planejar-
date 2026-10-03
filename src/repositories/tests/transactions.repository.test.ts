import { describe, expect, it, vi, beforeEach } from "vitest";

import { transactionsRepository } from "../transactions.repository";
import { prisma } from "../../lib/prisma";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";


describe("TransactionsRepository", () => {


    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("deve buscar transações de uma conta", async () => {

        const transactionsMock = [
            {
                id: "1",
                description: "Salário",
                amount: 5000,
                type: "INCOME",
                transactionDate: new Date("2026-08-15"),
            },

            {
                id: "2",
                description: "Aluguel",
                amount: 1500,
                type: "EXPENSE",
                transactionDate: new Date("2026-08-16"),
            }
        ];


        const findManyMock =
            vi.spyOn(
                prisma.transaction,
                "findMany"
            )
                .mockResolvedValue(
                    transactionsMock as any
                );


        const result =
            await transactionsRepository.findByAccountId(
                "account-id"
            );


        expect(result)
            .toHaveLength(2);


        expect(result[0].amount)
            .toBe(5000);


        expect(result[0].type)
            .toBe("INCOME");


        expect(result[1].amount)
            .toBe(1500);


        expect(result[1].type)
            .toBe("EXPENSE");


        expect(findManyMock)
            .toHaveBeenCalledWith({

                where: {
                    accountId: "account-id",
                    deletedAt: null
                },

                orderBy: {
                    transactionDate: "asc"
                }

            });

    });

    it("deve buscar transações dentro de um período financeiro", async () => {


        const transactionsMock = [
            {
                id: "1",
                description: "Salário",
                amount: 5000,
                type: "INCOME",
                transactionDate: new Date("2026-08-15"),
            }
        ];



        const findManyMock =
            vi.spyOn(
                prisma.transaction,
                "findMany"
            )
                .mockResolvedValue(
                    transactionsMock as any
                );



        const period =
            new FinancialPeriod(
                new Date("2026-08-01"),
                new Date("2026-08-31")
            );



        const result =
            await transactionsRepository.findByPeriod(
                "family-member-id",
                period
            );



        expect(result)
            .toHaveLength(1);

        expect(result[0].amount)
            .toBe(5000);

        expect(result[0].type)
            .toBe("INCOME");



        expect(findManyMock)
            .toHaveBeenCalledWith({
                where: {
                    familyMemberId: "family-member-id",

                    deletedAt: null,

                    transactionDate: {
                        gte: new Date("2026-08-01"),
                        lte: new Date("2026-08-31"),
                    },
                },

                orderBy: {
                    transactionDate: "desc",
                },
            });


    });

    it("deve buscar apenas receitas do período", async () => {


        const findManyMock =
            vi.spyOn(
                prisma.transaction,
                "findMany"
            )
                .mockResolvedValue([]);



        const period =
            FinancialPeriod.currentMonth();



        await transactionsRepository.findIncomeByPeriod(
            "family-member-id",
            period
        );



        expect(findManyMock)
            .toHaveBeenCalledWith({
                where: {
                    familyMemberId: "family-member-id",
                    type: "INCOME",
                    transactionDate: {
                        gte: period.startDate,
                        lte: period.endDate,
                    },
                },
            });


    });

    it("deve buscar apenas despesas do período", async () => {


        const findManyMock =
            vi.spyOn(
                prisma.transaction,
                "findMany"
            )
                .mockResolvedValue([]);



        const period =
            FinancialPeriod.currentMonth();



        await transactionsRepository.findExpensesByPeriod(
            "family-member-id",
            period
        );



        expect(findManyMock)
            .toHaveBeenCalledWith({
                where: {
                    familyMemberId: "family-member-id",
                    type: "EXPENSE",
                    transactionDate: {
                        gte: period.startDate,
                        lte: period.endDate,
                    },
                },
            });


    });

    it("deve criar uma transação", async () => {

        const transactionMock = {
            id: "transaction-id",

            familyMemberId:
                "family-member-id",

            accountId:
                "account-id",

            description:
                "Salário",

            notes:
                "Salário do mês",

            amount: 5000,

            type: "INCOME",

            status: "COMPLETED",

            transactionDate:
                new Date("2026-08-21"),

            effectiveDate:
                null,

            deletedAt:
                null,

            createdAt:
                new Date(),

            updatedAt:
                new Date(),
        };


        const createMock =
            vi.spyOn(
                prisma.transaction,
                "create"
            )
                .mockResolvedValue(
                    transactionMock as any
                );


        const result =
            await transactionsRepository.create({

                familyMemberId:
                    "family-member-id",

                accountId:
                    "account-id",

                description:
                    "Salário",

                notes:
                    "Salário do mês",

                amount:
                    5000,

                type:
                    "INCOME",

                status:
                    "COMPLETED",

                transactionDate:
                    new Date("2026-08-21"),

            });


        expect(createMock)
            .toHaveBeenCalledWith({

                data: {

                    familyMemberId:
                        "family-member-id",

                    accountId:
                        "account-id",

                    description:
                        "Salário",

                    notes:
                        "Salário do mês",

                    amount:
                        5000,

                    type:
                        "INCOME",

                    status:
                        "COMPLETED",

                    transactionDate:
                        new Date("2026-08-21"),

                },

            });


        expect(result)
            .toEqual(transactionMock);

    });

    it("deve listar o resumo dos lançamentos do período", async () => {

        const transactionsMock = [
            {
                id: "transaction-1",
                description: "Mercado",
                amount: 150,
                type: "EXPENSE",
                status: "COMPLETED",
                transactionDate: new Date("2026-08-20"),
            },
        ];

        const findManyMock =
            vi.spyOn(
                prisma.transaction,
                "findMany"
            )
                .mockResolvedValue(
                    transactionsMock as any
                );

        const period =
            new FinancialPeriod(
                new Date("2026-08-01"),
                new Date("2026-08-31")
            );

        const result =
            await transactionsRepository.findSummaryByPeriod(
                "family-member-id",
                period
            );

        expect(findManyMock)
            .toHaveBeenCalledWith({
                where: {
                    familyMemberId: "family-member-id",
                    deletedAt: null,
                    transactionDate: {
                        gte: period.startDate,
                        lte: period.endDate,
                    },
                },
                orderBy: {
                    transactionDate: "desc",
                },
            });

        expect(result)
            .toEqual(transactionsMock);

    });

    it("deve buscar o histórico a partir de uma data", async () => {
        const startDate = new Date(2026, 6, 3);

        const findManyMock = vi.spyOn(
            prisma.transaction,
            "findMany"
        ).mockResolvedValue([]);

        await transactionsRepository.findSummarySince(
            "family-member-id",
            startDate
        );

        expect(findManyMock).toHaveBeenCalledWith({
            where: {
                familyMemberId: "family-member-id",
                deletedAt: null,
                transactionDate: {
                    gte: startDate,
                },
            },
            orderBy: {
                transactionDate: "desc",
            },
        });
    });

    it("deve buscar o histórico completo quando não há data inicial", async () => {
        const findManyMock = vi.spyOn(
            prisma.transaction,
            "findMany"
        ).mockResolvedValue([]);

        await transactionsRepository.findSummarySince(
            "family-member-id",
            null
        );

        expect(findManyMock).toHaveBeenCalledWith({
            where: {
                familyMemberId: "family-member-id",
                deletedAt: null,
            },
            orderBy: {
                transactionDate: "desc",
            },
        });
    });
    
});