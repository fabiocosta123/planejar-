import { describe, expect, it, vi, beforeEach } from "vitest";

import { calculateFinancialFlowAction } from "../calculate-financial-flow.action";
import { transactionsService } from "../../../services/transactions.service";
import { FinancialFlowEntry } from "../../../domain/financial/models/financial-flow-entry";

describe("calculateFinancialFlowAction", () => {

beforeEach(() => {

vi.restoreAllMocks();


});

it("deve calcular e retornar o fluxo financeiro como contrato", async () => {


const flow = [

  new FinancialFlowEntry(
    new Date("2026-08-10"),
    500,
    200,
    1300
  ),

  new FinancialFlowEntry(
    new Date("2026-08-15"),
    0,
    100,
    1200
  )

];


vi.spyOn(
  transactionsService,
  "calculateFinancialFlow"
)
  .mockResolvedValue(flow);


const result =
  await calculateFinancialFlowAction(
    "family-member-id",
    new Date("2026-08-01"),
    new Date("2026-08-31"),
    1000
  );


expect(result)
  .toHaveLength(2);


expect(result[0])
  .toEqual({

    date: new Date("2026-08-10"),

    income: 500,

    expenses: 200,

    balance: 1300,

    isPositive: true,

    isNegative: false

  });


expect(result[1])
  .toEqual({

    date: new Date("2026-08-15"),

    income: 0,

    expenses: 100,

    balance: 1200,

    isPositive: true,

    isNegative: false

  });


expect(
  transactionsService.calculateFinancialFlow
)
  .toHaveBeenCalledWith(

    "family-member-id",

    expect.any(Object),

    1000

  );

});

});
