import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MobileActionBar, WhatsAppFloat } from "@/components/site/mobile-action-bar";
import { JsonLd, organizationJsonLd } from "@/components/site/json-ld";
import { RevealProvider } from "@/components/reveal";

/**
 * Layout for the public marketing site and tracking portal. The admin panel
 * sits in its own route group with its own chrome.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <JsonLd data={organizationJsonLd()} />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <MobileActionBar />
      <WhatsAppFloat />
      <RevealProvider />
    </>
  );
}
