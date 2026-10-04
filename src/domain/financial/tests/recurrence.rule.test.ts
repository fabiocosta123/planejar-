import { describe, expect, it } from "vitest";

import {
  dailyEndProblem,
  defaultDailyEnd,
  projectRecurringOccurrences,
  recurrenceHorizonEnd,
} from "../rules/recurrence.rule";

describe("projectRecurringOccurrences", () => {
  it("projeta o mês seguinte e preserva o dia 31", () => {
    const projected = projectRecurringOccurrences(
      [
        {
          amount: 100,
          type: "EXPENSE",
          description: "Aluguel",
          startDate: new Date(2026, 0, 31),
          endDate: null,
        },
      ],
      new Date(2026, 0, 31),
      new Date(2026, 2, 31)
    );

    expect(projected.map((item) => item.transactionDate)).toEqual([
      new Date(2026, 1, 28),
      new Date(2026, 2, 31),
    ]);

    expect(projected[0]).toMatchObject({
      amount: 100,
      type: "EXPENSE",
      status: "PENDING",
    });
  });

  it("usa 29 de fevereiro em ano bissexto", () => {
    const projected = projectRecurringOccurrences(
      [
        {
          amount: 10,
          type: "INCOME",
          description: "Salário",
          startDate: new Date(2024, 0, 31),
          endDate: null,
        },
      ],
      new Date(2024, 0, 31),
      new Date(2024, 1, 29)
    );

    expect(projected).toHaveLength(1);
    expect(projected[0].transactionDate).toEqual(new Date(2024, 1, 29));
  });

  it("para na data final da série", () => {
    const projected = projectRecurringOccurrences(
      [
        {
          amount: 80,
          type: "EXPENSE",
          description: "Internet",
          startDate: new Date(2026, 0, 31),
          endDate: new Date(2026, 2, 15),
        },
      ],
      new Date(2026, 0, 31),
      new Date(2026, 11, 31)
    );

    expect(projected.map((item) => item.transactionDate)).toEqual([
      new Date(2026, 1, 28),
    ]);
  });

  it("não repete um lançamento já registrado no mesmo dia", () => {
    const projected = projectRecurringOccurrences(
      [
        {
          amount: 80,
          type: "EXPENSE",
          description: "Internet",
          startDate: new Date(2026, 0, 10),
          endDate: null,
        },
      ],
      new Date(2026, 0, 3),
      new Date(2026, 4, 3),
      [
        {
          description: " Internet ",
          type: "EXPENSE",
          transactionDate: new Date(2026, 1, 10),
        },
      ]
    );

    expect(projected.map((item) => item.transactionDate)).toEqual([
      new Date(2026, 2, 10),
      new Date(2026, 3, 10),
    ]);
  });

  it("limita o horizonte a doze meses", () => {
    const reference = new Date(2026, 9, 3);

    expect(recurrenceHorizonEnd(reference)).toEqual(
      new Date(2027, 9, 3, 23, 59, 59, 999)
    );

    const projected = projectRecurringOccurrences(
      [
        {
          amount: 50,
          type: "EXPENSE",
          description: "Academia",
          startDate: new Date(2026, 9, 10),
          endDate: null,
        },
      ],
      reference,
      recurrenceHorizonEnd(reference)
    );

    expect(projected[0].transactionDate).toEqual(new Date(2026, 10, 10));
    expect(projected.at(-1)?.transactionDate).toEqual(new Date(2027, 8, 10));
    expect(projected).toHaveLength(11);
  });

  it("mantém o dia 31 mesmo quando a série começou num mês curto", () => {
    const projected = projectRecurringOccurrences(
      [
        {
          amount: 90,
          type: "EXPENSE",
          description: "Aluguel",
          startDate: new Date(2026, 1, 10),
          endDate: null,
          dayOfMonth: 31,
        },
      ],
      new Date(2026, 1, 10),
      new Date(2026, 2, 31)
    );

    expect(projected.map((item) => item.transactionDate)).toEqual([
      new Date(2026, 2, 31),
    ]);
  });

  it("projeta a série diária só nos dias úteis e para na data final", () => {
    const projected = projectRecurringOccurrences(
      [
        {
          amount: 120,
          type: "EXPENSE",
          description: "Diária do ajudante",
          startDate: new Date(2026, 9, 2),
          endDate: new Date(2026, 9, 9),
          frequency: "DAILY",
          weekdays: [1, 2, 3, 4, 5],
        },
      ],
      new Date(2026, 9, 3),
      new Date(2027, 9, 3)
    );

    expect(projected.map((item) => item.transactionDate)).toEqual([
      new Date(2026, 9, 5),
      new Date(2026, 9, 6),
      new Date(2026, 9, 7),
      new Date(2026, 9, 8),
      new Date(2026, 9, 9),
    ]);
  });

  it("não repete na projeção um dia que já foi lançado", () => {
    const projected = projectRecurringOccurrences(
      [
        {
          amount: 50,
          type: "INCOME",
          description: "Venda do dia",
          startDate: new Date(2026, 9, 3),
          endDate: new Date(2026, 9, 6),
          frequency: "DAILY",
          weekdays: [0, 1, 2, 3, 4, 5, 6],
        },
      ],
      new Date(2026, 9, 3),
      new Date(2027, 9, 3),
      [
        {
          description: "Venda do dia",
          type: "INCOME",
          transactionDate: new Date(2026, 9, 5),
        },
      ]
    );

    expect(projected.map((item) => item.transactionDate)).toEqual([
      new Date(2026, 9, 4),
      new Date(2026, 9, 6),
    ]);
  });
});

describe("dailyEndProblem", () => {
  it("assume o último dia do ano e aceita até 12 meses", () => {
    expect(defaultDailyEnd(new Date(2026, 9, 5))).toEqual(
      new Date(2026, 11, 31)
    );
    expect(defaultDailyEnd(new Date(2026, 11, 31))).toEqual(
      new Date(2027, 11, 31)
    );
    expect(
      dailyEndProblem(new Date(2026, 9, 5), new Date(2027, 9, 5))
    ).toBeNull();
    expect(
      dailyEndProblem(new Date(2026, 9, 5), new Date(2026, 9, 5))
    ).toBe("NOT_AFTER_START");
    expect(
      dailyEndProblem(new Date(2026, 9, 5), new Date(2027, 9, 6))
    ).toBe("TOO_FAR");
  });
});
