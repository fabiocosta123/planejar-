import { beforeEach, describe, expect, it, vi } from "vitest";

import { settingsService } from "../settings.service";
import { userSettingsRepository } from "../../repositories/user-settings.repository";
import { SettingsUpdateError } from "../errors/settings-update.error";

describe("preferências do usuário", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("grava reserva, dia do aperto e nível de aviso", async () => {
    vi.spyOn(userSettingsRepository, "findByUserId").mockResolvedValue({
      id: "settings-1",
    } as never);

    const updateSpy = vi
      .spyOn(userSettingsRepository, "update")
      .mockResolvedValue({} as never);

    await settingsService.updatePreferences("user-1", {
      minimumReserve: "250,00",
      dayOfTightnessAlert: false,
      notificationLevel: "NONE",
    });

    expect(updateSpy).toHaveBeenCalledWith("user-1", {
      minimumReserve: 250,
      dayOfTightnessAlert: false,
      notificationLevel: "NONE",
    });
  });

  it("não grava reserva negativa", async () => {
    const updateSpy = vi.spyOn(userSettingsRepository, "update");

    await expect(
      settingsService.updatePreferences("user-1", {
        minimumReserve: "-1,00",
        dayOfTightnessAlert: true,
        notificationLevel: "ALL",
      })
    ).rejects.toBeInstanceOf(SettingsUpdateError);

    expect(updateSpy).not.toHaveBeenCalled();
  });
});
