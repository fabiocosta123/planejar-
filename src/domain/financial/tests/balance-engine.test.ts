import { describe, it, expect } from 'vitest';
import { balanceEngine } from '../engine/balance-engine';

describe('BalanceEngine', () => {
    it('should calculate balance correctly', () => {
        const result = balanceEngine.calculate(5000, 3000);

        expect(result.income).toBe(5000);
        expect(result.expenses).toBe(3000);
        expect(result.balance).toBe(2000);
    });

    it("deve identificar saldo negativo", () => {

    const result = balanceEngine.calculate(
      2000,
      3500
    );


    expect(result.balance)
      .toBe(-1500);


    expect(result.isPositive)
      .toBe(false);
  });
});