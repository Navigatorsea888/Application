import "server-only";
import { prisma } from "./db";
import type { SessionUser } from "./auth";

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGIN_FAILED" | "LOGOUT" | "EXPORT";

/**
 * Audit writes must never take down the operation they are recording, so
 * failures here are swallowed after being logged to the server console.
 */
export async function recordAudit(params: {
  user?: SessionUser | null;
  userEmail?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  summary: string;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.user?.id ?? null,
        userEmail: params.user?.email ?? params.userEmail ?? null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId ?? null,
        summary: params.summary,
      },
    });
  } catch (error) {
    console.error("[audit] failed to record entry", error);
  }
}
