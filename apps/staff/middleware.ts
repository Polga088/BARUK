import { createAuthMiddleware } from "@repo/auth/middleware";

export default createAuthMiddleware("staff");

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
