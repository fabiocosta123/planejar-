import { accountsRepository } from "../repositories/accounts.repository";
import { transactionsRepository } from "../repositories/transactions.repository";
import { AccountMapper } from "../domain/accounts/mappers/account.mapper";
import { accountTypeLabel, isAccountType } from "../domain/accounts/account-type-label";
import { financialEngine } from "../domain/financial/engine/financial-engine";
import { LedgerAccountContract } from "../contracts/accounts/ledger-account.contract";
import { parseCreateAccountInput } from "../contracts/accounts/parse-create-account";
import { familyContextService } from "./family-context.service";
import { familyMemberService } from "./family-member.service";
import { AccountWriteError } from "./errors/account-write.error";


export class AccountsService {


  async findById(
    id: string
  ) {


    const account =
      await accountsRepository.findById(
        id
      );


    if (!account) {

      return null;

    }


    const domainAccount =
      AccountMapper.toDomain(
        account
      );


    return AccountMapper.toContract(
      domainAccount
    );

  }




  async findByFamilyMember(
    familyMemberId: string
  ) {


    const accounts =
      await accountsRepository.findByFamilyMember(
        familyMemberId
      );


    return accounts
      .slice()
      .sort(
        (left, right) =>
          Number(Boolean(right.isDefault)) - Number(Boolean(left.isDefault))
      )
      .map(
        account =>
          AccountMapper.toContract(
            AccountMapper.toDomain(
              account
            )
          )
      );

  }

  async listForLedger(
    familyMemberId: string,
    referenceDate: Date = new Date()
  ): Promise<LedgerAccountContract[]> {
    const accounts = await accountsRepository.findByFamilyMember(
      familyMemberId
    );

    const visible = accounts.filter((account) => !account.deletedAt);
    const rows: LedgerAccountContract[] = [];

    for (const account of visible) {
      const transactions = await transactionsRepository.findByAccountId(
        account.id
      );
      const type = isAccountType(account.type) ? account.type : "OTHER";

      rows.push({
        id: account.id,
        name: account.name,
        type,
        typeLabel: accountTypeLabel(type),
        balance: financialEngine.calculateCurrentBalance(
          Number(account.initialBalance),
          transactions,
          referenceDate
        ),
        isDefault: Boolean(account.isDefault),
        isActive: account.isActive !== false,
      });
    }

    return rows.sort((left, right) => {
      if (left.isDefault !== right.isDefault) {
        return left.isDefault ? -1 : 1;
      }

      return left.name.localeCompare(right.name, "pt-BR");
    });
  }

  async createForUser(userId: string, input: unknown) {
    const parsed = parseCreateAccountInput(input);

    if (!parsed.ok) {
      throw new AccountWriteError(parsed.message);
    }

    const ledgerMemberId = await this.requireWriter(userId);
    const existing = await accountsRepository.findByFamilyMember(
      ledgerMemberId
    );
    const openAccounts = existing.filter(
      (account) => !account.deletedAt && account.isActive !== false
    );
    const makeDefault =
      openAccounts.length === 0 || parsed.value.useAsDefault;

    const account = await accountsRepository.create({
      familyMemberId: ledgerMemberId,
      name: parsed.value.name,
      type: parsed.value.type,
      initialBalance: parsed.value.initialBalance,
      initialBalanceDate: parsed.value.initialBalanceDate,
      isDefault: false,
    });

    if (makeDefault) {
      await accountsRepository.setDefault(ledgerMemberId, account.id);
    }

    return account.id;
  }

  async setDefaultForUser(userId: string, accountId: unknown) {
    if (typeof accountId !== "string" || accountId.trim().length === 0) {
      throw new AccountWriteError("Conta não encontrada.");
    }

    const ledgerMemberId = await this.requireWriter(userId);
    const updated = await accountsRepository.setDefault(
      ledgerMemberId,
      accountId.trim()
    );

    if (updated === 0) {
      throw new AccountWriteError("Conta não encontrada.");
    }
  }

  private async requireWriter(userId: string) {
    const context = await familyContextService.getCurrentContext(userId);

    if (!context) {
      throw new AccountWriteError("Nenhuma família encontrada.");
    }

    const member = await familyMemberService.findById(context.familyMemberId);

    if (!member || member.deletedAt) {
      throw new AccountWriteError("Nenhuma família encontrada.");
    }

    if (member.role === "VIEWER") {
      throw new AccountWriteError("Seu acesso permite apenas consulta.");
    }

    return context.ledgerMemberId ?? context.familyMemberId;
  }




  async create(
    data: {
      familyMemberId: string;

      name: string;

      type:
        | "CHECKING"
        | "SAVINGS"
        | "CASH"
        | "INVESTMENT"
        | "OTHER";

      initialBalanceDate: Date;

      initialBalance: number;

    }
  ) {


    const account =
      await accountsRepository.create(
        data
      );


    return AccountMapper.toContract(

      AccountMapper.toDomain(
        account
      )

    );

  }


}


export const accountsService =
  new AccountsService();