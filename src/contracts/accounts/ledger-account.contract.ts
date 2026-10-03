import { AccountTypeCode } from "../../domain/accounts/account-type-label";

export interface LedgerAccountContract {
  id: string;
  name: string;
  type: AccountTypeCode;
  typeLabel: string;
  balance: number;
  isDefault: boolean;
  isActive: boolean;
}
