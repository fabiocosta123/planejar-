import { describe, expect, it } from "vitest";

import {
  parseCreateTransactionInput,
  parseUpdateSeriesInput,
} from "../parse-create-transaction";

const validInput = {
  accountId: "account-1",
  description: " Mercado ",
  amount: "1.234,56",
  type: "EXPENSE",
  transactionDate: "2026-08-20",
  notes: "  ",
};

describe("parseCreateTransactionInput", () => {
  it("deve aceitar valor em reais", () => {
    const result = parseCreateTransactionInput(validInput);

    expect(result).toEqual({
      ok: true,
      value: {
        accountId: "account-1",
        description: "Mercado",
        amount: 1234.56,
        type: "EXPENSE",
        transactionDate: new Date(2026, 7, 20),
        notes: undefined,
        repeatsMonthly: false,
      },
    });
  });

  it("deve recusar valor zero ou negativo", () => {
    expect(
      parseCreateTransactionInput({
        ...validInput,
        amount: "0,00",
      })
    ).toMatchObject({
      ok: false,
    });

    expect(
      parseCreateTransactionInput({
        ...validInput,
        amount: -10,
      })
    ).toMatchObject({
      ok: false,
    });
  });

  it("deve aceitar repetição mensal", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      repeatsMonthly: true,
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        repeatsMonthly: true,
      },
    });
  });

  it("deve recusar repetição inválida", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      repeatsMonthly: "mensal",
    });

    expect(result).toMatchObject({
      ok: false,
      message: "Não foi possível ler a repetição.",
    });
  });

  it("deve aceitar a alteração da repetição", () => {
    const result = parseUpdateSeriesInput({
      id: "series-1",
      accountId: "account-1",
      description: " Aluguel ",
      amount: "800,00",
      type: "EXPENSE",
      dayOfMonth: "10",
    });

    expect(result).toEqual({
      ok: true,
      value: {
        id: "series-1",
        accountId: "account-1",
        description: "Aluguel",
        amount: 800,
        type: "EXPENSE",
        frequency: "MONTHLY",
        dayOfMonth: 10,
        endDate: null,
      },
    });
  });

  it("deve repetir todo mês sem data para acabar quando não há fim", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      repeat: "MONTHLY",
      monthlyEnd: "NONE",
    });

    expect(result).toMatchObject({
      ok: true,
      value: { repeatsMonthly: true, monthlyEndDate: undefined },
    });
  });

  it("deve calcular a última vez da repetição mensal pelo número de vezes", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      transactionDate: "2026-01-31",
      repeat: "MONTHLY",
      monthlyEnd: "TIMES",
      repeatTimes: "3",
    });

    expect(result).toMatchObject({
      ok: true,
      value: { repeatsMonthly: true, monthlyEndDate: new Date(2026, 2, 31) },
    });
  });

  it("deve recusar número de vezes fora do limite", () => {
    for (const repeatTimes of ["1", "121", "abc"]) {
      expect(
        parseCreateTransactionInput({
          ...validInput,
          repeat: "MONTHLY",
          monthlyEnd: "TIMES",
          repeatTimes,
        })
      ).toEqual({ ok: false, message: "Informe de 2 a 120 vezes." });
    }
  });

  it("deve aceitar repetição mensal até a data informada", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      transactionDate: "2026-10-10",
      repeat: "MONTHLY",
      monthlyEnd: "UNTIL",
      repeatUntil: "2027-06-10",
    });

    expect(result).toMatchObject({
      ok: true,
      value: { monthlyEndDate: new Date(2027, 5, 10) },
    });
  });

  it("deve recusar repetição mensal com data final antes do lançamento", () => {
    expect(
      parseCreateTransactionInput({
        ...validInput,
        transactionDate: "2026-10-10",
        repeat: "MONTHLY",
        monthlyEnd: "UNTIL",
        repeatUntil: "2026-10-10",
      })
    ).toEqual({
      ok: false,
      message: "A data final precisa ser depois do primeiro lançamento.",
    });
  });

  it("deve aceitar a data final na alteração da repetição mensal", () => {
    expect(
      parseUpdateSeriesInput({
        id: "series-1",
        accountId: "account-1",
        description: "Aluguel",
        amount: "800,00",
        type: "EXPENSE",
        frequency: "MONTHLY",
        dayOfMonth: "10",
        endDate: "2027-06-10",
      })
    ).toMatchObject({
      ok: true,
      value: { frequency: "MONTHLY", endDate: new Date(2027, 5, 10) },
    });
  });

  it("deve aceitar repetição diária de segunda a sexta até a data informada", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      transactionDate: "2026-10-05",
      repeat: "DAILY",
      weekdays: [5, 1, 2, 3, 4],
      repeatUntil: "2026-11-30",
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        repeatsMonthly: false,
        daily: {
          weekdays: [1, 2, 3, 4, 5],
          endDate: new Date(2026, 10, 30),
        },
      },
    });
  });

  it("deve assumir o último dia do ano quando a data final fica vazia", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      transactionDate: "2026-10-05",
      repeat: "DAILY",
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      repeatUntil: "",
    });

    expect(result).toMatchObject({
      ok: true,
      value: {
        daily: { endDate: new Date(2026, 11, 31) },
      },
    });
  });

  it("deve recusar repetição diária sem dias da semana", () => {
    expect(
      parseCreateTransactionInput({
        ...validInput,
        repeat: "DAILY",
        weekdays: [],
      })
    ).toMatchObject({
      ok: false,
      message: "Escolha em quais dias da semana o lançamento se repete.",
    });
  });

  it("deve aceitar começar num dia fora dos dias escolhidos", () => {
    expect(
      parseCreateTransactionInput({
        ...validInput,
        transactionDate: "2026-10-04",
        repeat: "DAILY",
        weekdays: [1, 2, 3, 4, 5, 6],
        repeatUntil: "2026-10-14",
      })
    ).toMatchObject({
      ok: true,
      value: {
        daily: {
          weekdays: [1, 2, 3, 4, 5, 6],
          endDate: new Date(2026, 9, 14),
        },
      },
    });
  });

  it("deve recusar data final antes do lançamento ou depois de 12 meses", () => {
    const base = {
      ...validInput,
      transactionDate: "2026-10-05",
      repeat: "DAILY",
      weekdays: [1],
    };

    expect(
      parseCreateTransactionInput({ ...base, repeatUntil: "2026-10-05" })
    ).toMatchObject({
      ok: false,
      message: "A data final precisa ser depois do primeiro lançamento.",
    });

    expect(
      parseCreateTransactionInput({ ...base, repeatUntil: "2027-10-06" })
    ).toMatchObject({
      ok: false,
      message: "A repetição diária pode durar até 12 meses.",
    });
  });

  it("deve aceitar a alteração da repetição diária", () => {
    expect(
      parseUpdateSeriesInput({
        id: "series-1",
        accountId: "account-1",
        description: "Diarista",
        amount: "150,00",
        type: "EXPENSE",
        frequency: "DAILY",
        weekdays: [2, 4],
        endDate: "2026-12-31",
      })
    ).toEqual({
      ok: true,
      value: {
        id: "series-1",
        accountId: "account-1",
        description: "Diarista",
        amount: 150,
        type: "EXPENSE",
        frequency: "DAILY",
        weekdays: [2, 4],
        endDate: new Date(2026, 11, 31),
      },
    });
  });

  it("deve recusar dia fora do mês", () => {
    const result = parseUpdateSeriesInput({
      id: "series-1",
      accountId: "account-1",
      description: "Aluguel",
      amount: "10,00",
      type: "EXPENSE",
      dayOfMonth: "32",
    });

    expect(result).toMatchObject({
      ok: false,
      message: "Informe um dia entre 1 e 31.",
    });
  });

  it("deve recusar data inválida", () => {
    const result = parseCreateTransactionInput({
      ...validInput,
      transactionDate: "2026-02-31",
    });

    expect(result).toMatchObject({
      ok: false,
      message: "Informe uma data válida (DD/MM/AAAA).",
    });
  });
});
