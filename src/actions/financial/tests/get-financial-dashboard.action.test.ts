import {
beforeEach,
describe,
expect,
it,
vi
} from "vitest";

import {
getFinancialDashboardAction
} from "../get-financial-dashboard.action";

import {
transactionsService
} from "../../../services/transactions.service";

import {
FinancialSummary
} from "../../../domain/financial/models/financial-summary";

import {
FutureBalanceResult
} from "../../../domain/financial/models/future-balance-result";

import {
FinancialFlowEntry
} from "../../../domain/financial/models/financial-flow-entry";

describe(
"getFinancialDashboardAction",
() => {


beforeEach(() => {

  vi.restoreAllMocks();

});


it(
  "deve retornar o dashboard financeiro completo",
  async () => {

    const summary =
      new FinancialSummary(
        5000,
        3000,
        2000,
        false
      );


    const futureBalance =
      new FutureBalanceResult(
        2000,
        1000,
        1500
      );


    const financialFlow = [

      new FinancialFlowEntry(
        new Date("2026-08-10"),
        500,
        200,
        2300
      ),

      new FinancialFlowEntry(
        new Date("2026-08-15"),
        0,
        300,
        2000
      )

    ];


    vi.spyOn(
      transactionsService,
      "calculateDashboard"
    )
      .mockResolvedValue({

        summary,

        futureBalance,

        financialFlow

      });


    const result =
      await getFinancialDashboardAction(

        "family-member-id",

        new Date("2026-08-01"),

        new Date("2026-08-31"),

        2000,

        3500

      );


    expect(result.summary)
      .toEqual({

        income: 5000,

        expenses: 3000,

        balance: 2000,

        limitExceeded: false

      });


    expect(result.futureBalance)
      .toEqual({

        currentBalance: 2000,

        futureIncome: 1000,

        futureExpenses: 1500,

        futureBalance: 1500,

        isPositive: true,

        isNegative: false

      });


    expect(result.financialFlow)
      .toHaveLength(2);


    expect(result.financialFlow[0])
      .toEqual({

        date:
          new Date("2026-08-10"),

        income: 500,

        expenses: 200,

        balance: 2300,

        isPositive: true,

        isNegative: false

      });


    expect(result.financialFlow[1])
      .toEqual({

        date:
          new Date("2026-08-15"),

        income: 0,

        expenses: 300,

        balance: 2000,

        isPositive: true,

        isNegative: false

      });


    expect(
      transactionsService.calculateDashboard
    )
      .toHaveBeenCalledWith(

        "family-member-id",

        expect.any(Object),

        2000,

        3500

      );

  }

);


}

);
