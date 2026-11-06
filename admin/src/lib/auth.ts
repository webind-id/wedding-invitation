import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { fingerprint, SESSION_COOKIE, sessionSecret, verifySession } from "./session";
import { db } from "./supabase";

export interface Admin {
  username: string;
}

/**
 * Verifikasi sesi di setiap halaman & server action. Selain tanda tangan
 * cookie, akun harus masih ada dan password-nya belum diganti sejak login.
 * Di-cache per request agar layout + halaman tidak query dua kali.
 */
export const currentAdmin = cache(async (): Promise<Admin | null> => {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value, sessionSecret());
  if (!session) return null;

  // DB belum dikonfigurasi → anggap belum login; halaman /masuk yang menjelaskan masalahnya.
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;

  const { data, error } = await db()
    .from("admin_users")
    .select("username, password_hash")
    .eq("username", session.sub)
    .maybeSingle();
  if (error) console.error("[auth]", error);
  if (error || !data) return null;
  return (await fingerprint(data.password_hash as string)) === session.ver ? { username: session.sub } : null;
});

export async function requireAdmin(): Promise<Admin> {
  const admin = await currentAdmin();
  if (!admin) redirect("/masuk");
  return admin;
}
