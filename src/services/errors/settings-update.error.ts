export class SettingsUpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SettingsUpdateError";
  }
}
