export type AccountType =
  | "CHECKING"
  | "SAVINGS"
  | "CASH"
  | "INVESTMENT"
  | "OTHER";


export class Account {


  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: AccountType,
    private balance: number = 0
  ) {

    if (!name.trim()) {
      throw new Error(
        "Nome da conta é obrigatório"
      );
    }

  }


  get currentBalance(): number {
    return this.balance;
  }


  credit(
    amount: number
  ): void {

    this.validateAmount(amount);

    this.balance += amount;

  }


  debit(
    amount: number
  ): void {

    this.validateAmount(amount);

    this.balance -= amount;

  }


  private validateAmount(
    amount: number
  ): void {

    if (amount <= 0) {
      throw new Error(
        "Valor deve ser positivo"
      );
    }

  }
}