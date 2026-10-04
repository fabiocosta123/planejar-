import { userSettingsRepository } from "../repositories/user-settings.repository";
import { UpdateSettingsDto } from "../types/settings/update-settings.dto";
import { parseSettingsInput } from "../contracts/settings/parse-settings";
import { SettingsUpdateError } from "./errors/settings-update.error";

export class SettingsService {
  async getSettings(userId: string) {
    let settings = await userSettingsRepository.findByUserId(userId);

    if (!settings) {
      settings = await userSettingsRepository.create(userId);
    }

    return settings;
  }

  async updatePreferences(userId: string, input: unknown) {
    const parsed = parseSettingsInput(input);

    if (!parsed.ok) {
      throw new SettingsUpdateError(parsed.message);
    }

    await this.getSettings(userId);

    await userSettingsRepository.update(userId, {
      minimumReserve: parsed.value.minimumReserve,
      dayOfTightnessAlert: parsed.value.dayOfTightnessAlert,
      notificationLevel: parsed.value.notificationLevel,
    });
  }

  async updateSettings(
    userId: string,
    data: UpdateSettingsDto
  ) {
    return userSettingsRepository.update(userId, data);
  }
}

export const settingsService = new SettingsService();