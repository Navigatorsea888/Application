import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-page flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-[family-name:var(--font-mono)] text-sm text-accent-600">404</p>
        <h1 className="mt-4 text-3xl">Page not found</h1>
        <p className="mt-4 max-w-md text-ink-600">
          That page does not exist. If you were trying to track a shipment, the tracking portal is below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/track">Track a shipment</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Back to home
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-ink-500">
          Or{" "}
          <Link href="/contact" className="text-accent-600 underline underline-offset-2">
            contact us
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
