import { describe, expect, it, vi } from "vitest";
import { AccountsService } from "../accounts.service";
import { accountsRepository } from "../../repositories/accounts.repository";


vi.mock("../../repositories/accounts.repository", () => ({

  accountsRepository: {

    findById: vi.fn(),

    findByFamilyMember: vi.fn(),

    create: vi.fn(),

  }

}));


describe("AccountsService", () => {


  const service =
    new AccountsService();



  it("deve buscar conta por id", async () => {


    vi.mocked(
      accountsRepository.findById
    )
    .mockResolvedValue({

      id:"1",

      name:"Conta Corrente",

      type:"CHECKING",

      initialBalance:1500

    } as any);



    const result =
      await service.findById(
        "1"
      );



    expect(result)
    .toEqual({

      id:"1",

      name:"Conta Corrente",

      type:"CHECKING",

      balance:1500

    });


  });




  it("deve buscar contas do membro da família", async () => {


    vi.mocked(
      accountsRepository.findByFamilyMember
    )
    .mockResolvedValue([

      {

        id:"1",

        name:"Carteira",

        type:"CASH",

        initialBalance:500

      },

      {

        id:"2",

        name:"Banco",

        type:"CHECKING",

        initialBalance:2000

      }

    ] as any);



    const result =
      await service.findByFamilyMember(
        "member-1"
      );



    expect(result)
    .toEqual([

      {

        id:"1",

        name:"Carteira",

        type:"CASH",

        balance:500

      },

      {

        id:"2",

        name:"Banco",

        type:"CHECKING",

        balance:2000

      }

    ]);

  });





  it("deve criar uma conta", async () => {


    vi.mocked(
      accountsRepository.create
    )
    .mockResolvedValue({

      id:"account-1",

      name:"Nubank",

      type:"CHECKING",

      initialBalance:1000

    } as any);



    const result =
      await service.create({

        familyMemberId:"member-1",

        name:"Nubank",

        type:"CHECKING",

        initialBalanceDate:
          new Date(),

        initialBalance:1000

      });



    expect(result)
    .toEqual({

      id:"account-1",

      name:"Nubank",

      type:"CHECKING",

      balance:1000

    });


  });


});