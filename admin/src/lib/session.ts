/**
 * Cookie sesi admin yang ditandatangani HMAC-SHA256 lewat Web Crypto,
 * sehingga bisa diverifikasi di middleware (Edge) maupun di server.
 * Format token: base64url(JSON payload) + "." + base64url(signature).
 *
 * `ver` adalah sidik jari hash password: mengganti password membuat semua
 * token lama ditolak oleh requireAdmin() (lihat auth.ts).
 */

export const SESSION_COOKIE = "kudo_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;
const MIN_SECRET_LENGTH = 32;

export interface SessionPayload {
  sub: string;
  ver: string;
  exp: number;
}

/** SESSION_SECRET dari env, atau undefined bila kosong/terlalu pendek. */
export function sessionSecret(): string | undefined {
  const secret = process.env.SESSION_SECRET;
  return secret && secret.length >= MIN_SECRET_LENGTH ? secret : undefined;
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

/** Sidik jari pendek dari hash password (bukan rahasia; hanya pembeda versi). */
export async function fingerprint(passwordHash: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(passwordHash));
  return toBase64Url(new Uint8Array(digest)).slice(0, 16);
}

export async function signSession(
  username: string,
  ver: string,
  secret: string,
  nowMs: number = Date.now(),
): Promise<string> {
  const payload: SessionPayload = { sub: username, ver, exp: Math.floor(nowMs / 1000) + SESSION_TTL_SECONDS };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySession(
  token: string | undefined,
  secret: string | undefined,
  nowMs: number = Date.now(),
): Promise<SessionPayload | null> {
  if (!token || !secret) return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return null;

  try {
    // crypto.subtle.verify membandingkan dalam waktu konstan.
    const valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), fromBase64Url(signature), encoder.encode(body));
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as Partial<SessionPayload>;
    if (typeof payload.sub !== "string" || typeof payload.ver !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp * 1000 <= nowMs) return null;
    return { sub: payload.sub, ver: payload.ver, exp: payload.exp };
  } catch {
    return null;
  }
}
