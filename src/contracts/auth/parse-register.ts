import { normalizeInviteCode } from "../../domain/family/invite-code";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  principal: boolean;
  inviteCode: string | null;
}

export function parseRegisterInput(
  input: unknown
): { ok: true; value: RegisterInput } | { ok: false; message: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Preencha o cadastro." };
  }

  const data = input as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
    principal?: unknown;
    inviteCode?: unknown;
  };

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const password = typeof data.password === "string" ? data.password : "";
  const principal = data.principal === true;
  const inviteCode =
    typeof data.inviteCode === "string"
      ? normalizeInviteCode(data.inviteCode)
      : "";

  if (name.length < 2) {
    return { ok: false, message: "Informe seu nome." };
  }

  if (!email.includes("@") || email.length > 120) {
    return { ok: false, message: "Informe um e-mail válido." };
  }

  if (password.length < 8) {
    return { ok: false, message: "A senha precisa ter pelo menos 8 caracteres." };
  }

  if (!principal && inviteCode.length < 6) {
    return {
      ok: false,
      message: "Informe o código da família do usuário principal.",
    };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      password,
      principal,
      inviteCode: principal ? null : inviteCode,
    },
  };
}
