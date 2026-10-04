import { familyMemberRepository } from "../repositories/family-member.repository";
import { FamilyMemberMapper } from "../domain/family/mappers/family-member.mapper";

export class FamilyMemberService {

  async findById(
    id: string
  ) {

    const member =
      await familyMemberRepository.findById(
        id
      );

    if (!member) {
      return null;
    }

    return FamilyMemberMapper.toContract(
      FamilyMemberMapper.toDomain(
        member
      )
    );
  }


  async findByUserId(
    userId: string
  ) {

    const members =
      await familyMemberRepository.findByUserId(
        userId
      );

    return members.map(
      member =>
        FamilyMemberMapper.toContract(
          FamilyMemberMapper.toDomain(
            member
          )
        )
    );
  }


  async findByFamilyId(
    familyId: string
  ) {

    const members =
      await familyMemberRepository.findByFamilyId(
        familyId
      );

    return members.map(
      member =>
        FamilyMemberMapper.toContract(
          FamilyMemberMapper.toDomain(
            member
          )
        )
    );
  }


  async findByFamilyAndUser(
    familyId: string,
    userId: string
  ) {

    const member =
      await familyMemberRepository.findByFamilyAndUser(
        familyId,
        userId
      );

    if (!member) {
      return null;
    }

    return FamilyMemberMapper.toContract(
      FamilyMemberMapper.toDomain(
        member
      )
    );
  }


  async create(
    data: {
      familyId: string;
      userId: string;
      role:
        | "OWNER"
        | "MEMBER"
        | "VIEWER";
    }
  ) {

    const existingMember =
      await familyMemberRepository.findByFamilyAndUser(
        data.familyId,
        data.userId
      );

    if (existingMember) {
      return FamilyMemberMapper.toContract(
        FamilyMemberMapper.toDomain(
          existingMember
        )
      );
    }

    const member =
      await familyMemberRepository.create(
        data
      );

    return FamilyMemberMapper.toContract(
      FamilyMemberMapper.toDomain(
        member
      )
    );
  }


  async updateRole(
    id: string,
    role:
      | "OWNER"
      | "MEMBER"
      | "VIEWER"
  ) {

    const member =
      await familyMemberRepository.findById(
        id
      );

    if (!member) {
      return null;
    }

    const updatedMember =
      await familyMemberRepository.updateRole(
        id,
        role
      );

    return FamilyMemberMapper.toContract(
      FamilyMemberMapper.toDomain(
        updatedMember
      )
    );
  }


  async delete(
    id: string
  ) {

    const member =
      await familyMemberRepository.findById(
        id
      );

    if (!member) {
      return null;
    }

    const deletedMember =
      await familyMemberRepository.delete(
        id
      );

    return FamilyMemberMapper.toContract(
      FamilyMemberMapper.toDomain(
        deletedMember
      )
    );
  }

}


export const familyMemberService =
  new FamilyMemberService();