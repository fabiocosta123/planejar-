import { prisma } from "../lib/prisma";

import { familyRepository } from "../repositories/family.repository";
import { familyMemberRepository } from "../repositories/family-member.repository";
import { userSettingsRepository } from "../repositories/user-settings.repository";

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

          
          // 1. Cria a família         

          const family =
            await familyRepository.createWithClient(
              tx,
              data
            );


          
          // 2. Cria o OWNER         

          const owner =
            await familyMemberRepository.createWithClient(
              tx,
              {
                familyId: family.id,
                userId: data.ownerId,
                role: "OWNER"
              }
            );


          
          // 3. Garante UserSettings         

          const settings =
            await userSettingsRepository.findByUserIdWithClient(
              tx,
              data.ownerId
            );


          if (!settings) {

            await userSettingsRepository.createWithClient(
              tx,
              data.ownerId
            );

          }


          
          // 4. Define a família atual
          

          await userSettingsRepository.updateCurrentFamilyWithClient(
            tx,
            data.ownerId,
            family.id
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