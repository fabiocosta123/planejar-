import {
  FamilyMember,
  FamilyRole
} from "../models/family-member";

export class FamilyMemberMapper {

  static toDomain(
    data: {
      id: string;
      familyId: string;
      userId: string;
      role: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
    }
  ): FamilyMember {

    return {
      id: data.id,

      familyId: data.familyId,

      userId: data.userId,

      role: data.role as FamilyRole,

      createdAt: data.createdAt,

      updatedAt: data.updatedAt,

      deletedAt: data.deletedAt
    };

  }


  static toContract(
    member: FamilyMember
  ) {

    return {
      id: member.id,

      familyId: member.familyId,

      userId: member.userId,

      role: member.role,

      createdAt: member.createdAt,

      updatedAt: member.updatedAt,

      deletedAt: member.deletedAt
    };

  }

}