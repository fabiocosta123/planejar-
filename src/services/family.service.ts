import { prisma } from "../lib/prisma";
import { familyRepository } from "../repositories/family.repository";
import { familyMemberRepository } from "../repositories/family-member.repository";
import { FamilyMapper } from "../domain/family/mappers/family.mapper";
import { FamilyMemberMapper } from "../domain/family/mappers/family-member.mapper";

export class FamilyService {

  async findById(
    id: string
  ) {

    const family =
      await familyRepository.findById(
        id
      );

    if (!family) {
      return null;
    }

    return FamilyMapper.toContract(
      FamilyMapper.toDomain(
        family
      )
    );
  }


  async findByOwnerId(
    ownerId: string
  ) {

    const families =
      await familyRepository.findByOwnerId(
        ownerId
      );

    return families.map(
      family =>
        FamilyMapper.toContract(
          FamilyMapper.toDomain(
            family
          )
        )
    );
  }


  async create(
    data: {
      name: string;
      ownerId: string;
    }
  ) {

    const result =
      await prisma.$transaction(
        async (tx) => {

          const family =
            await familyRepository.createWithClient(
              tx,
              data
            );

          const owner =
            await familyMemberRepository.createWithClient(
              tx,
              {
                familyId: family.id,
                userId: data.ownerId,
                role: "OWNER"
              }
            );

          return {
            family,
            owner
          };

        }
      );


    return {

      family:
        FamilyMapper.toContract(
          FamilyMapper.toDomain(
            result.family
          )
        ),

      owner:
        FamilyMemberMapper.toContract(
          FamilyMemberMapper.toDomain(
            result.owner
          )
        )

    };

  }


  async update(
    id: string,
    data: {
      name?: string;
    }
  ) {

    const family =
      await familyRepository.findById(
        id
      );

    if (!family) {
      return null;
    }

    const updatedFamily =
      await familyRepository.update(
        id,
        data
      );

    return FamilyMapper.toContract(
      FamilyMapper.toDomain(
        updatedFamily
      )
    );

  }


  async delete(
    id: string
  ) {

    const family =
      await familyRepository.findById(
        id
      );

    if (!family) {
      return null;
    }

    const deletedFamily =
      await familyRepository.delete(
        id
      );

    return FamilyMapper.toContract(
      FamilyMapper.toDomain(
        deletedFamily
      )
    );

  }

}


export const familyService =
  new FamilyService();