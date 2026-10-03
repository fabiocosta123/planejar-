import { timingSafeEqual } from "crypto";

export function tokensMatch(expected: string, received: string) {
  if (!expected || expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}
