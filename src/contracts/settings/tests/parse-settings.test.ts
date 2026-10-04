import { describe, expect, it } from "vitest";

import { parseSettingsInput } from "../parse-settings";

describe("parseSettingsInput", () => {
  it("aceita reserva zero e avisos importantes", () => {
    expect(
      parseSettingsInput({
        minimumReserve: "0,00",
        dayOfTightnessAlert: true,
        notificationLevel: "IMPORTANT",
      })
    ).toEqual({
      ok: true,
      value: {
        minimumReserve: 0,
        dayOfTightnessAlert: true,
        notificationLevel: "IMPORTANT",
      },
    });
  });

  it("lê a reserva no formato brasileiro", () => {
    const result = parseSettingsInput({
      minimumReserve: "1.250,50",
      dayOfTightnessAlert: false,
      notificationLevel: "NONE",
    });

    expect(result).toMatchObject({
      ok: true,
      value: { minimumReserve: 1250.5, notificationLevel: "NONE" },
    });
  });

  it("recusa reserva negativa e nível desconhecido", () => {
    expect(
      parseSettingsInput({
        minimumReserve: "-10,00",
        dayOfTightnessAlert: true,
        notificationLevel: "IMPORTANT",
      }).ok
    ).toBe(false);

    expect(
      parseSettingsInput({
        minimumReserve: "10,00",
        dayOfTightnessAlert: true,
        notificationLevel: "URGENT",
      })
    ).toMatchObject({
      ok: false,
      message: "Escolha o nível dos avisos.",
    });
  });
});
