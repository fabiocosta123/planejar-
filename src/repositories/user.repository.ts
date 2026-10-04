import { prisma } from "../lib/prisma";

export class UserRepository {

  async findByEmail(
    email: string
  ) {

    return prisma.user.findUnique({
      where: {
        email
      }
    });

  }


  async findById(
    id: string
  ) {

    return prisma.user.findUnique({
      where: {
        id
      }
    });

  }


  async create(
    data: {
      name: string;
      email: string;
      passwordHash: string;
    }
  ) {

    return prisma.user.create({
      data
    });

  }


  async remove(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

}


export const userRepository =
  new UserRepository();