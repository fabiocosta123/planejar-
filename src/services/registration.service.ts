import { Prisma } from "../lib/generated/prisma/client";

import { parseRegisterInput } from "../contracts/auth/parse-register";
import { hashPassword } from "../lib/password";
import { familyRepository } from "../repositories/family.repository";
import { familyMemberRepository } from "../repositories/family-member.repository";
import { userSettingsRepository } from "../repositories/user-settings.repository";
import { familyService } from "./family.service";
import { usersService } from "./users.service";

export class RegistrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistrationError";
  }
}

export class RegistrationService {
  async register(input: unknown) {
    const parsed = parseRegisterInput(input);

    if (!parsed.ok) {
      throw new RegistrationError(parsed.message);
    }

    const existing = await usersService.findByEmail(parsed.value.email);

    if (existing) {
      throw new RegistrationError("Já existe uma conta com esse e-mail.");
    }

    const passwordHash = await hashPassword(parsed.value.password);
    const user = await usersService.create({
      name: parsed.value.name,
      email: parsed.value.email,
      passwordHash,
    });

    try {
      if (parsed.value.principal) {
        const firstName = parsed.value.name.split(" ")[0];
        await familyService.create({
          name: `Família de ${firstName}`,
          ownerId: user.id,
        });
        return;
      }

      const family = await familyRepository.findByInviteCode(
        parsed.value.inviteCode ?? ""
      );

      if (!family || family.deletedAt) {
        throw new RegistrationError("Código da família não encontrado.");
      }

      await familyMemberRepository.create({
        familyId: family.id,
        userId: user.id,
        role: "MEMBER",
      });
      await userSettingsRepository.create(user.id);
      await userSettingsRepository.updateCurrentFamily(user.id, family.id);
    } catch (error) {
      await usersService.remove(user.id);

      if (error instanceof RegistrationError) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new RegistrationError("Já existe uma conta com esse e-mail.");
      }

      throw new RegistrationError("Não foi possível criar a conta.");
    }
  }
}

export const registrationService = new RegistrationService();
