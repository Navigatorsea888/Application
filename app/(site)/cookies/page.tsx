import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui";
import { PageHero } from "@/components/site/page-hero";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cookie Policy | Navigator Sea Land Limited",
  description: "How navigatorsealand.com uses cookies and similar technologies, and how to control them.",
  alternates: { canonical: "/cookies" },
};

const LAST_UPDATED = "24 September 2026";

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Cookie Policy" lead={`Last updated: ${LAST_UPDATED}`} crumbs={[{ label: "Cookie Policy", href: "/cookies" }]} />

      <div className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Alert tone="warning" title="Review required before publication">
            This policy is a working draft describing the cookies the site sets today. It has not been reviewed by a lawyer. Confirm it against
            the Kazakh Personal Data Law and, where EU visitors are targeted, the ePrivacy rules and GDPR, and update it when analytics or
            marketing tags are added.
          </Alert>

          <div className="prose-body mt-10 space-y-8">
            <Section title="1. What cookies are">
              <p>
                Cookies are small text files a website stores on your device. Similar technologies include local storage and pixels. This
                policy explains which ones navigatorsealand.com, operated by {company.legalName}, uses and why.
              </p>
            </Section>

            <Section title="2. Cookies we set">
              <p>The site currently sets only cookies that are strictly necessary for it to work:</p>
              <div className="overflow-x-auto rounded-lg border border-ink-200">
                <table className="w-full text-sm">
                  <caption className="sr-only">Cookies set by this website</caption>
                  <thead>
                    <tr className="bg-ink-50 text-left">
                      <th scope="col" className="px-4 py-2.5 font-semibold">Cookie</th>
                      <th scope="col" className="px-4 py-2.5 font-semibold">Purpose</th>
                      <th scope="col" className="px-4 py-2.5 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-200">
                    <tr>
                      <th scope="row" className="px-4 py-2.5 font-mono text-xs">nsl_session</th>
                      <td className="px-4 py-2.5">Keeps staff signed in to the operations panel at /admin. Set only when a member of staff signs in.</td>
                      <td className="px-4 py-2.5">Up to 12 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                No advertising, analytics or social-media cookies are set at present. If Google Analytics 4 or conversion tracking is added
                (the deck plans GA4 with conversion tracking on the quote form, WhatsApp and phone clicks), this table and section 4 must be
                updated and a consent mechanism added first.
              </p>
            </Section>

            <Section title="3. Third-party content">
              <p>
                Fonts are loaded from Google Fonts, which may record your IP address when the font files are requested. Embedded maps, where
                present on the Contact page, are served by Google Maps and are subject to Google&rsquo;s own cookie policy.
              </p>
            </Section>

            <Section title="4. Managing cookies">
              <p>
                You can delete or block cookies through your browser settings. Blocking the strictly necessary cookie will prevent staff from
                signing in to the operations panel but does not affect the public website, the quote form or shipment tracking.
              </p>
            </Section>

            <Section title="5. Contact">
              <p>
                Questions about this policy: <a href={`mailto:${company.email}`}>{company.email}</a>. See also our{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </Section>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
