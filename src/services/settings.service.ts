import { userSettingsRepository } from "../repositories/user-settings.repository";
import { UpdateSettingsDto } from "../types/settings/update-settings.dto";

export class SettingsService {
  async getSettings(userId: string) {
    let settings = await userSettingsRepository.findByUserId(userId);

    if (!settings) {
      settings = await userSettingsRepository.create(userId);
    }

    return settings;
  }

  async updateSettings(
    userId: string,
    data: UpdateSettingsDto
  ) {
    return userSettingsRepository.update(userId, data);
  }
}

export const settingsService = new SettingsService();