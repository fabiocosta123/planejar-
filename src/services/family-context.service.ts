import { familyMemberService } from "./family-member.service";
import { userSettingsRepository } from "../repositories/user-settings.repository";

export interface CurrentFamilyContext {
  familyId: string;
  familyMemberId: string;
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

        return {
          familyId: settings.currentFamilyId,
          familyMemberId: familyMember.id
        };

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

    return {
      familyId: firstFamilyMember.familyId,
      familyMemberId: firstFamilyMember.id
    };

  }

}

export const familyContextService =
  new FamilyContextService();