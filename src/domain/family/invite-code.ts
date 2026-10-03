const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createInviteCode() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join(
    ""
  );
}

export function normalizeInviteCode(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}
