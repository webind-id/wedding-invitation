"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { failure, type ActionResult } from "@/lib/action";
import { decoy, verifyPassword } from "@/lib/password";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { fingerprint, SESSION_COOKIE, SESSION_TTL_SECONDS, sessionSecret, signSession } from "@/lib/session";
import { ConfigError, db } from "@/lib/supabase";

const WINDOW_MS = 15 * 60 * 1000;
const ipLimiter = createRateLimiter(8, WINDOW_MS);
// Per IP+username, bukan username saja — agar penyerang tidak bisa mengunci admin asli.
const userLimiter = createRateLimiter(5, WINDOW_MS);
const TOO_MANY = "Terlalu banyak percobaan. Tunggu 15 menit.";

export async function login(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const secret = sessionSecret();
  if (!secret) return failure(new ConfigError().message);
  const ip = clientIp(await headers());
  if (!ipLimiter.check(ip)) return failure(TOO_MANY);

  const username = String(form.get("username") ?? "").trim().slice(0, 40);
  const password = String(form.get("password") ?? "").slice(0, 200);
  if (!username || !password) return failure("Username dan password wajib diisi.");
  if (!userLimiter.check(`${ip}|${username.toLowerCase()}`)) return failure(TOO_MANY);

  let client: ReturnType<typeof db>;
  try {
    client = db();
  } catch (err) {
    return failure(err instanceof ConfigError ? err.message : "Server belum siap.");
  }

  const { data, error } = await client
    .from("admin_users")
    .select("username, password_hash")
    .eq("username", username)
    .maybeSingle();
  if (error) {
    console.error("[login]", error);
    return failure("Gagal memeriksa akun. Pastikan schema.sql sudah dijalankan.");
  }

  // Username tak dikenal tetap menjalankan scrypt agar waktunya tidak membocorkan apa-apa.
  const hash = (data?.password_hash as string | undefined) ?? (await decoy());
  const isValid = await verifyPassword(password, hash);
  if (!data || !isValid) return failure("Username atau password salah.");

  const token = await signSession(username, await fingerprint(hash), secret);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/masuk");
}
