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

    if (!settings?.currentFamilyId) {
      return null;
    }

    const familyMember =
      await familyMemberService.findByFamilyAndUser(
        settings.currentFamilyId,
        userId
      );

    if (!familyMember) {
      return null;
    }

    return {
      familyId: settings.currentFamilyId,
      familyMemberId: familyMember.id
    };
  }
}

export const familyContextService =
  new FamilyContextService();