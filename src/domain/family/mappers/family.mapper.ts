import { Family } from "../models/family";

export class FamilyMapper {

  static toDomain(
    data: {
      id: string;
      name: string;
      ownerId: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
    }
  ): Family {

    return {

      id: data.id,

      name: data.name,

      ownerId: data.ownerId,

      createdAt: data.createdAt,

      updatedAt: data.updatedAt,

      deletedAt: data.deletedAt

    };

  }


  static toContract(
    family: Family
  ) {

    return {

      id: family.id,

      name: family.name,

      ownerId: family.ownerId,

      createdAt: family.createdAt,

      updatedAt: family.updatedAt,

      deletedAt: family.deletedAt

    };

  }

}