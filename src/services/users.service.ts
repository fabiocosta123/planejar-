import { userRepository } from "../repositories/user.repository";


export class UsersService {


  async findByEmail(
    email: string
  ) {

    return userRepository.findByEmail(
      email
    );

  }


  async findById(
    id: string
  ) {

    return userRepository.findById(
      id
    );

  }


  async create(
    data: {
      name: string;
      email: string;
      passwordHash: string;
    }
  ) {

    return userRepository.create(
      data
    );

  }


  async remove(id: string) {
    return userRepository.remove(id);
  }

}


export const usersService =
  new UsersService();