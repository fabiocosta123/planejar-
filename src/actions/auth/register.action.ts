"use server";

import { RegistrationError, registrationService } from "../../services/registration.service";

export async function registerAction(input: unknown) {
  try {
    await registrationService.register(input);
    return { success: true as const };
  } catch (error) {
    if (error instanceof RegistrationError) {
      return {
        success: false as const,
        error: { message: error.message },
      };
    }

    return {
      success: false as const,
      error: { message: "Não foi possível criar a conta." },
    };
  }
}
