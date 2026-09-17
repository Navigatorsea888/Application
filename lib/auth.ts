import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { ROLE_RANK, type Role } from "./constants";

const COOKIE_NAME = "nsl_session";
const MIN_SECRET_LENGTH = 32;

function sessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    // Failing loudly beats silently signing sessions with a guessable key.
    throw new Error(
      `SESSION_SECRET must be set and at least ${MIN_SECRET_LENGTH} characters. Generate one with: openssl rand -base64 48`,
    );
  }
  return new TextEncoder().encode(secret);
}

function maxAgeSeconds(): number {
  const hours = Number.parseInt(process.env.SESSION_MAX_AGE_HOURS ?? "12", 10);
  return (Number.isFinite(hours) && hours > 0 ? hours : 12) * 3600;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  office: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    office: user.office,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSeconds()}s`)
    .sign(sessionSecret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds(),
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/**
 * Reads the session cookie and re-checks the user against the database on
 * every request. A deactivated account therefore loses access immediately
 * rather than when its token happens to expire.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    const userId = payload.sub;
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, office: true, isActive: true },
    });
    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      office: user.office,
    };
  } catch {
    return null;
  }
}

export function hasRole(user: SessionUser | null, minimum: Role): boolean {
  if (!user) return false;
  return (ROLE_RANK[user.role] ?? 0) >= ROLE_RANK[minimum];
}

/** Throws when the caller lacks the role; callers in route handlers catch it. */
export class AuthorizationError extends Error {
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthorizationError("You must sign in to continue.");
  return user;
}

export async function requireRole(minimum: Role): Promise<SessionUser> {
  const user = await requireUser();
  if (!hasRole(user, minimum)) throw new AuthorizationError();
  return user;
}

/** True when the user may create, edit or delete records. */
export function canWrite(user: SessionUser | null): boolean {
  return hasRole(user, "OPERATOR");
}

export function canAdminister(user: SessionUser | null): boolean {
  return hasRole(user, "ADMIN");
}
