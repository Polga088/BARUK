import type { UserRole } from "@repo/database";

export type { UserRole };

export const ROLES = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  STAFF: "STAFF",
} as const satisfies Record<string, UserRole>;

export type AppRole = keyof typeof ROLES;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string | null;
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 3,
  OWNER: 2,
  STAFF: 1,
};

export function hasMinimumRole(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const APP_ACCESS: Record<string, UserRole[]> = {
  admin: [ROLES.ADMIN],
  owner: [ROLES.ADMIN, ROLES.OWNER],
  staff: [ROLES.ADMIN, ROLES.OWNER, ROLES.STAFF],
  web: [],
};

export function canAccessApp(app: keyof typeof APP_ACCESS, role: UserRole): boolean {
  const allowed = APP_ACCESS[app] ?? [];
  if (allowed.length === 0) return true;
  return allowed.includes(role);
}
