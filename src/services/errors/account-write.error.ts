export class AccountWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccountWriteError";
  }
}
