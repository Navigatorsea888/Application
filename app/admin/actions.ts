"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { createSession, destroySession, getSessionUser, verifyPassword } from "@/lib/auth";
import { fieldErrors, formDataToObject, loginSchema } from "@/lib/validation";
import { recordAudit } from "@/lib/audit";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { headers } from "next/headers";
import type { Role } from "@/lib/constants";

export interface LoginState {
  status: "idle" | "error";
  message?: string;
  errors?: Record<string, string>;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Enter your email and password.", errors: fieldErrors(parsed.error) };
  }

  const email = parsed.data.email.toLowerCase();
  const ip = clientIp(await headers());

  // Throttle on both the IP and the account, so neither a single attacker nor
  // a distributed one can brute-force a password at speed.
  const [byIp, byAccount] = await Promise.all([
    checkRateLimit(`login-ip:${ip}`, 10, 900),
    checkRateLimit(`login-user:${email}`, 8, 900),
  ]);

  if (!byIp.allowed || !byAccount.allowed) {
    const wait = Math.ceil(Math.max(byIp.retryAfterSeconds, byAccount.retryAfterSeconds) / 60);
    await recordAudit({
      userEmail: email,
      action: "LOGIN_FAILED",
      entityType: "User",
      summary: `Rate-limited sign-in attempt from ${ip}`,
    });
    return { status: "error", message: `Too many attempts. Try again in about ${wait} minutes.` };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // One message for every failure mode, so the form cannot be used to discover
  // which email addresses have accounts.
  const genericFailure: LoginState = { status: "error", message: "Email or password is incorrect." };

  if (!user) {
    await recordAudit({ userEmail: email, action: "LOGIN_FAILED", entityType: "User", summary: `Unknown email from ${ip}` });
    return genericFailure;
  }

  const passwordOk = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!passwordOk) {
    await recordAudit({ userEmail: email, action: "LOGIN_FAILED", entityType: "User", entityId: user.id, summary: `Wrong password from ${ip}` });
    return genericFailure;
  }

  if (!user.isActive) {
    await recordAudit({ userEmail: email, action: "LOGIN_FAILED", entityType: "User", entityId: user.id, summary: "Deactivated account" });
    return { status: "error", message: "This account has been deactivated. Contact an administrator." };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
    office: user.office,
  });

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await recordAudit({
    user: { id: user.id, email: user.email, name: user.name, role: user.role as Role, office: user.office },
    action: "LOGIN",
    entityType: "User",
    entityId: user.id,
    summary: `Signed in from ${ip}`,
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const user = await getSessionUser();
  if (user) {
    await recordAudit({ user, action: "LOGOUT", entityType: "User", entityId: user.id, summary: "Signed out" });
  }
  await destroySession();
  revalidatePath("/admin");
  redirect("/admin/login");
}
