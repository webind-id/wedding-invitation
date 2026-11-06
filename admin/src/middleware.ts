import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, sessionSecret, verifySession } from "@/lib/session";

/**
 * Gerbang cepat di Edge: tanpa cookie bertanda tangan valid → ke /masuk.
 * Pemeriksaan penuh (akun masih ada, password belum diganti) tetap
 * dilakukan requireAdmin() di setiap halaman & server action.
 */
export async function middleware(req: NextRequest) {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value, sessionSecret());
  if (session) return NextResponse.next();
  return NextResponse.redirect(new URL("/masuk", req.url));
}

export const config = {
  matcher: ["/((?!masuk|_next/|favicon.ico).*)"],
};
