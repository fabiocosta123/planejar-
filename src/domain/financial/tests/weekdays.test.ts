import { describe, expect, it } from "vitest";

import { weekdaysLabel } from "../rules/weekdays";

describe("weekdaysLabel", () => {
  it("descreve os grupos de dias mais comuns", () => {
    expect(weekdaysLabel([0, 1, 2, 3, 4, 5, 6])).toBe("todos os dias");
    expect(weekdaysLabel([5, 4, 3, 2, 1])).toBe("segunda a sexta");
    expect(weekdaysLabel([1, 2, 3, 4, 5, 6])).toBe("segunda a sábado");
  });

  it("lista os dias escolhidos fora dos grupos", () => {
    expect(weekdaysLabel([4, 2])).toBe("ter, qui");
    expect(weekdaysLabel([0, 1, 2, 4, 5])).toBe("seg, ter, qui, sex, dom");
  });
});
