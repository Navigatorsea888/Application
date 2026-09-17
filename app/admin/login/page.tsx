import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Already signed in — no reason to show the form again.
  if (await getSessionUser()) redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-lg border border-ink-200 bg-white p-7">
          <h1 className="text-xl">Operations sign in</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            For Navigator Sea Land staff. Client shipment tracking is on the{" "}
            <Link href="/track" className="text-accent-600 underline underline-offset-2">
              tracking page
            </Link>
            .
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          <Link href="/" className="hover:text-ink-700">
            ← Back to navigatorsealand.com
          </Link>
        </p>
      </div>
    </div>
  );
}
