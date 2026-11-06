#!/usr/bin/env node
/**
 * Buat / perbarui akun admin di tabel `admin_users`.
 * Pemakaian: npm run admin:user -- <username> <password>
 *
 * Hash memakai skema yang sama dengan src/lib/password.ts
 * (scrypt$<salt>$<hash>). Mengganti password otomatis membatalkan
 * semua sesi lama akun tersebut (lihat src/lib/auth.ts).
 */
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";

function readEnvFile(path) {
  try {
    return Object.fromEntries(
      readFileSync(path, "utf8")
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#") && l.includes("="))
        .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
    );
  } catch {
    return {};
  }
}

function exit(message) {
  console.error(message);
  process.exit(1);
}

const [username, password] = process.argv.slice(2);
if (!username || !password) exit("Pemakaian: npm run admin:user -- <username> <password>");
if (username.length < 3 || username.length > 40) exit("Username harus 3–40 karakter.");
if (password.length < 10) exit("Password minimal 10 karakter.");

const env = { ...readEnvFile(".env.local"), ...process.env };
const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) exit("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local.");

const salt = randomBytes(16).toString("hex");
const hash = `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;

const res = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/admin_users?on_conflict=username`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify([{ username, password_hash: hash }]),
});

if (!res.ok) exit(`Gagal menyimpan (${res.status}): ${await res.text().catch(() => "")}`);
console.log(`Akun "${username}" tersimpan. Masuk di /masuk.`);
