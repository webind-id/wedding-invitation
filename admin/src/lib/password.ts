import { randomBytes, scrypt, timingSafeEqual, type BinaryLike } from "node:crypto";

/**
 * Hash password memakai scrypt bawaan Node. Format tersimpan:
 *   scrypt$<saltHex>$<hashHex>
 * Skema yang sama dipakai scripts/create-admin.mjs.
 */
const KEY_LEN = 64;

function derive(password: BinaryLike, salt: BinaryLike): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LEN, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await derive(password, salt);
  return `scrypt$${salt}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await derive(password, salt);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Hash pengganti untuk username tak dikenal, agar waktu respons login tetap seragam. */
let decoyHash: Promise<string> | null = null;
export function decoy(): Promise<string> {
  decoyHash ??= hashPassword(randomBytes(18).toString("hex"));
  return decoyHash;
}
