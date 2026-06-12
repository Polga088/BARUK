import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./config";
import { canAccessApp } from "./types";
import type { UserRole } from "./types";

export function createAuthMiddleware(appName: "admin" | "owner" | "staff") {
  return async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/health") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/login")
    ) {
      return NextResponse.next();
    }

    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!canAccessApp(appName, session.user.role as UserRole)) {
      return NextResponse.redirect(new URL("/login?error=access_denied", request.url));
    }

    return NextResponse.next();
  };
}

export { auth, signIn, signOut } from "./config";
