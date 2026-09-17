import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Alert, Card, Pill } from "@/components/ui";
import { UserForm } from "@/components/admin/user-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deactivateUser } from "../user-actions";
import { prisma } from "@/lib/db";
import { canAdminister, getSessionUser } from "@/lib/auth";
import { OFFICES, ROLES } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Staff accounts" };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const currentUser = await getSessionUser();
  if (!canAdminister(currentUser)) redirect("/admin");

  const [users, recentAudit] = await Promise.all([
    prisma.user.findMany({ orderBy: [{ isActive: "desc" }, { name: "asc" }] }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Staff accounts"
        description="Administrators only. Accounts are deactivated rather than deleted so the audit trail stays intact."
      />

      <div className="grid gap-6 p-5 sm:p-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Alert tone="info" title="What each role can do">
            <ul className="mt-1 space-y-1">
              <li>
                <strong>Administrator</strong> — everything, including deleting shipments and managing accounts.
              </li>
              <li>
                <strong>Operations</strong> — create and edit shipments, add checkpoints, manage quotes and
                enquiries. Cannot delete shipments or manage accounts.
              </li>
              <li>
                <strong>View only</strong> — read everything, change nothing.
              </li>
            </ul>
          </Alert>

          <div className="space-y-4">
            {users.map((user) => {
              const deactivateAction = deactivateUser.bind(null, user.id);
              const isSelf = user.id === currentUser!.id;

              return (
                <Card key={user.id} className={`p-5 ${user.isActive ? "" : "opacity-60"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-[family-name:var(--font-display)] font-semibold text-ink-900">
                          {user.name}
                        </p>
                        {isSelf ? <Pill tone="accent">You</Pill> : null}
                        {!user.isActive ? <Pill tone="signal">Deactivated</Pill> : null}
                      </div>
                      <p className="mt-0.5 text-sm text-ink-600">{user.email}</p>
                      <p className="mt-0.5 text-sm text-ink-500">
                        {ROLES[user.role as keyof typeof ROLES] ?? user.role} ·{" "}
                        {OFFICES[user.office as keyof typeof OFFICES] ?? user.office}
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        Last signed in: {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "never"}
                      </p>
                    </div>

                    {user.isActive && !isSelf ? (
                      <form action={deactivateAction}>
                        <ConfirmButton
                          message={`Deactivate ${user.name}? They will be signed out and unable to sign in again until reactivated.`}
                          className="inline-flex h-8 cursor-pointer items-center rounded px-2 text-xs font-medium text-danger-600 hover:bg-danger-50"
                        >
                          Deactivate
                        </ConfirmButton>
                      </form>
                    ) : null}
                  </div>

                  <details className="mt-4 border-t border-ink-200 pt-4">
                    <summary className="cursor-pointer text-sm font-medium text-accent-600">
                      Edit account / reset password
                    </summary>
                    <div className="mt-4">
                      <UserForm user={user} />
                    </div>
                  </details>
                </Card>
              );
            })}
          </div>

          <Card>
            <div className="border-b border-ink-200 px-5 py-4">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">Audit log</h2>
              <p className="mt-0.5 text-sm text-ink-500">The 25 most recent actions.</p>
            </div>
            <ul className="divide-y divide-ink-200">
              {recentAudit.map((entry) => (
                <li key={entry.id} className="px-5 py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm text-ink-800">{entry.summary}</p>
                    <time className="font-[family-name:var(--font-mono)] text-xs text-ink-500">
                      {formatDateTime(entry.createdAt)}
                    </time>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {entry.userEmail ?? "system"} · {entry.action} · {entry.entityType}
                  </p>
                </li>
              ))}
              {recentAudit.length === 0 ? (
                <li className="px-5 py-8 text-center text-sm text-ink-500">Nothing recorded yet.</li>
              ) : null}
            </ul>
          </Card>
        </div>

        <Card className="h-fit p-5">
          <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">New staff account</h2>
          <p className="mt-1 text-sm text-ink-500">
            Set a password here and pass it to the person over a channel other than email, then have them change it.
          </p>
          <div className="mt-5">
            <UserForm />
          </div>
        </Card>
      </div>
    </>
  );
}
