export class TransactionCreateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionCreateError";
  }
}
