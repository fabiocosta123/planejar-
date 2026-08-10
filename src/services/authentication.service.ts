import { usersService } from "./users.service";
import { verifyPassword } from "../lib/password";

export class AuthenticationService {

  async authenticate(
    email: string,
    password: string
  ) {

    if (!email || !password) {
      return null;
    }

    const user =
      await usersService.findByEmail(
        email
      );

    if (!user) {
      return null;
    }

    if (
      user.status !== "ACTIVE"
    ) {
      return null;
    }

    if (!user.passwordHash) {
      return null;
    }

    const passwordValid =
      await verifyPassword(
        password,
        user.passwordHash
      );

    if (!passwordValid) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image
    };
  }
}

export const authenticationService =
  new AuthenticationService();