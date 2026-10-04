import { familyMemberService } from "./family-member.service";
import { userSettingsRepository } from "../repositories/user-settings.repository";

export interface CurrentFamilyContext {
  familyId: string;
  familyMemberId: string;
  ledgerMemberId: string;
}

export class FamilyContextService {

  async getCurrentContext(
    userId: string
  ): Promise<CurrentFamilyContext | null> {

    const settings =
      await userSettingsRepository.findByUserId(
        userId
      );

    if (settings?.currentFamilyId) {

      const familyMember =
        await familyMemberService.findByFamilyAndUser(
          settings.currentFamilyId,
          userId
        );

      if (familyMember) {

        return this.withLedger(
          settings.currentFamilyId,
          familyMember.id
        );

      }

    }

    const familyMembers =
      await familyMemberService.findByUserId(
        userId
      );

    const firstFamilyMember =
      familyMembers.find(
        member => !member.deletedAt
      );

    if (!firstFamilyMember) {
      return null;
    }

    if (settings) {

      await userSettingsRepository.updateCurrentFamily(
        userId,
        firstFamilyMember.familyId
      );

    } else {

      await userSettingsRepository.create(
        userId
      );

      await userSettingsRepository.updateCurrentFamily(
        userId,
        firstFamilyMember.familyId
      );

    }

    return this.withLedger(
      firstFamilyMember.familyId,
      firstFamilyMember.id
    );

  }

  private async withLedger(familyId: string, familyMemberId: string) {
    const members = await familyMemberService.findByFamilyId(familyId);
    const owner = members.find(
      (member) => member.role === "OWNER" && !member.deletedAt
    );

    return {
      familyId,
      familyMemberId,
      ledgerMemberId: owner?.id ?? familyMemberId,
    };
  }

}

export const familyContextService =
  new FamilyContextService();