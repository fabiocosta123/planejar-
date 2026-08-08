import { describe, expect, it, vi, beforeEach } from "vitest";

import { transactionsRepository } from "../transactions.repository";
import { prisma } from "../../lib/prisma";
import { FinancialPeriod } from "../../domain/financial/models/financial-period";


describe("TransactionsRepository", () => {


    beforeEach(() => {
        vi.restoreAllMocks();
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
                    transactionDate: {
                        gte: period.startDate,
                        lte: period.endDate,
                    },
                },
                orderBy: {
                    transactionDate: "asc",
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


});