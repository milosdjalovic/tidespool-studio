import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "tidespool_admin_session";

function getSessionSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "tidespool-local-dev-secret";

  return new TextEncoder().encode(secret);
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, getSessionSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await isAuthenticated(request);

  if (pathname.startsWith("/admin/dashboard")) {
    if (!authenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/admin/login") && authenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (
    (pathname.startsWith("/api/admin") ||
      (pathname.startsWith("/api/portfolio") && request.method !== "GET") ||
      pathname.startsWith("/api/messages")) &&
    !authenticated
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/login",
    "/api/admin/:path*",
    "/api/portfolio",
    "/api/portfolio/:path*",
    "/api/messages/:path*",
  ],
};
