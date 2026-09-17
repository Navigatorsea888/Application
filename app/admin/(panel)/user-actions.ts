"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { hashPassword, requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { fieldErrors, formDataToObject, userSchema } from "@/lib/validation";

export interface UserState {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Record<string, string>;
}

export async function saveUser(_prev: UserState, formData: FormData): Promise<UserState> {
  const actor = await requireRole("ADMIN");

  const id = String(formData.get("id") ?? "").trim();
  const parsed = userSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please correct the highlighted fields.", errors: fieldErrors(parsed.error) };
  }

  const { name, email, role, office, isActive, password } = parsed.data;

  // A new account needs a password; an existing one keeps its current password
  // unless a replacement is supplied.
  if (!id && !password) {
    return { status: "error", message: "Set a password for the new account.", errors: { password: "Required for a new account." } };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== id) {
    return { status: "error", message: "That email address is already in use.", errors: { email: "Already in use." } };
  }

  if (id) {
    // Guard against an administrator locking everyone out of the panel.
    if (actor.id === id && (role !== "ADMIN" || !isActive)) {
      return {
        status: "error",
        message: "You cannot remove your own administrator access or deactivate your own account.",
      };
    }
    if (role !== "ADMIN" || !isActive) {
      const otherAdmins = await prisma.user.count({
        where: { role: "ADMIN", isActive: true, id: { not: id } },
      });
      if (otherAdmins === 0) {
        return { status: "error", message: "This is the last active administrator. Promote another account first." };
      }
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        office,
        isActive,
        ...(password ? { passwordHash: await hashPassword(password) } : {}),
      },
    });
    await recordAudit({
      user: actor,
      action: "UPDATE",
      entityType: "User",
      entityId: id,
      summary: `Updated staff account ${email} (${role}${password ? ", password reset" : ""})`,
    });
    return { status: "success", message: "Account updated." };
  }

  const created = await prisma.user.create({
    data: { name, email, role, office, isActive, passwordHash: await hashPassword(password!) },
  });
  await recordAudit({
    user: actor,
    action: "CREATE",
    entityType: "User",
    entityId: created.id,
    summary: `Created staff account ${email} (${role})`,
  });

  revalidatePath("/admin/users");
  return { status: "success", message: "Account created." };
}

export async function deactivateUser(userId: string): Promise<void> {
  const actor = await requireRole("ADMIN");
  if (actor.id === userId) return;

  const remaining = await prisma.user.count({ where: { role: "ADMIN", isActive: true, id: { not: userId } } });
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, role: true } });
  if (!target) return;
  if (target.role === "ADMIN" && remaining === 0) return;

  // Accounts are deactivated rather than deleted so that the audit trail and
  // the authorship of every checkpoint they recorded stay intact.
  await prisma.user.update({ where: { id: userId }, data: { isActive: false } });
  await recordAudit({
    user: actor,
    action: "UPDATE",
    entityType: "User",
    entityId: userId,
    summary: `Deactivated staff account ${target.email}`,
  });

  revalidatePath("/admin/users");
}
