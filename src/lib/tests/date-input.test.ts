import { describe, expect, it } from "vitest";

import {
  brazilianToIso,
  isoToBrazilian,
  maskBrazilianDate,
} from "../date-input";

describe("date-input", () => {
  it("coloca as barras enquanto a pessoa digita", () => {
    expect(maskBrazilianDate("1")).toBe("1");
    expect(maskBrazilianDate("141")).toBe("14/1");
    expect(maskBrazilianDate("14102026")).toBe("14/10/2026");
    expect(maskBrazilianDate("14/10/20269")).toBe("14/10/2026");
  });

  it("converte entre DD/MM/AAAA e AAAA-MM-DD", () => {
    expect(brazilianToIso("14/10/2026")).toBe("2026-10-14");
    expect(isoToBrazilian("2026-10-14")).toBe("14/10/2026");
    expect(brazilianToIso("")).toBe("");
  });

  it("mantém data incompleta ou inexistente para o servidor recusar", () => {
    expect(brazilianToIso("14/10")).toBe("14/10");
    expect(brazilianToIso("31/02/2026")).toBe("31/02/2026");
  });
});
