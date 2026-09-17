import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";
import { logout } from "@/app/admin/actions";

/**
 * Guards everything under /admin except the login page. The session is checked
 * against the database on every request, so deactivating a user takes effect
 * immediately rather than at token expiry.
 */
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const [quotes, enquiries] = await Promise.all([
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.shipmentEnquiry.count({ where: { status: "NEW" } }),
  ]);

  return (
    <AdminShell user={user} badges={{ quotes, enquiries }} logoutAction={logout}>
      {children}
    </AdminShell>
  );
}
