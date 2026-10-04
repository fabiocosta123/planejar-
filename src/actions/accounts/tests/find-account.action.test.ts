import { describe, expect, it, vi, beforeEach } from "vitest";
import { findAccountAction } from "../find-account.action";
import { accountsService } from "../../../services/accounts.service";


vi.mock(
  "../../../services/accounts.service",
  () => ({

    accountsService: {

      findById: vi.fn()

    }

  })
);


describe("findAccountAction", () => {


  beforeEach(() => {

    vi.clearAllMocks();

  });



  it("deve buscar uma conta pelo id", async () => {


    const accountMock = {

      id: "account-1",

      name: "Nubank",

      type: "CHECKING",

      balance: 1000

    };


    vi.mocked(
      accountsService.findById
    )
    .mockResolvedValue(
      accountMock
    );



    const result =
      await findAccountAction(
        "account-1"
      );



    expect(
      accountsService.findById
    )
    .toHaveBeenCalledWith(
      "account-1"
    );



    expect(result)
      .toEqual(accountMock);


  });


});