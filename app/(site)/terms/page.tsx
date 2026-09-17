import type { Metadata } from "next";
import { Alert } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Website terms of use and the trading conditions under which Navigator Sea Land Limited contracts.",
};

const LAST_UPDATED = "17 September 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" lead={`Last updated: ${LAST_UPDATED}`} />

      <div className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Alert tone="warning" title="Review required before publication">
            These are website terms of use only. They are a draft and have not been reviewed by a lawyer.
            Critically, the trading conditions under which you contract — which govern liability, and which are
            the commercially important document — must be identified and attached in section 5 before this page is
            published.
          </Alert>

          <div className="prose-body mt-10 space-y-8">
            <Section title="1. These terms">
              <p>
                These terms govern your use of this website. {company.legalName} operates it from its offices in
                Almaty, Kazakhstan. By using the site you accept these terms.
              </p>
            </Section>

            <Section title="2. Information on this site is not an offer">
              <p>
                Descriptions of services, corridors, transit times and past projects are provided for general
                information. They are not an offer capable of acceptance, and they do not form part of any
                contract. Transit times in particular are indicative: multimodal cross-border movements are
                subject to vessel and ferry schedules, wagon allocation, border processing, customs clearance,
                permit issuance, weather and route availability.
              </p>
              <p>
                A binding commitment arises only from a written quotation or booking confirmation issued by us and
                accepted by you.
              </p>
            </Section>

            <Section title="3. Shipment tracking">
              <p>
                The tracking facility reports the position as last recorded by our operations staff. Entries are
                made manually as information is received from carriers, agents, terminals and authorities, and
                there may be a delay between an event occurring and its appearing here.
              </p>
              <p>
                Estimated dates shown are estimates and are not a guarantee of delivery by that date. Where a date
                is contractually committed, the commitment is in the transport contract, not on this page.
              </p>
              <p>
                Access to a shipment record requires the Tracking ID together with the consignee email address or
                the contract reference, unless we have opened a particular shipment for viewing with the Tracking
                ID alone at the client&rsquo;s request. You must not attempt to access records you are not
                entitled to see, and you must not use automated means to enumerate Tracking IDs.
              </p>
            </Section>

            <Section title="4. Quotation and enquiry forms">
              <p>
                Information you submit through the quotation and enquiry forms must be accurate, and you must be
                entitled to provide it. Cargo dimensions, weights and descriptions are relied on when we plan a
                movement and apply for permits; inaccurate information can make a quotation void and a movement
                impossible.
              </p>
              <p>
                Submitting a form does not create a contract and does not reserve capacity.
              </p>
            </Section>

            <Section title="5. Trading conditions">
              <p>
                <strong>
                  [BRACKETED — MUST BE COMPLETED: identify the trading conditions under which Navigator Sea Land
                  contracts, and attach or link them. For a forwarder in this region that is commonly a national
                  freight forwarders&rsquo; association standard, FIATA model rules, or the company&rsquo;s own
                  standard trading conditions. Confirm which applies to each contracting entity, and state that
                  they limit liability.]
                </strong>
              </p>
              <p>
                All services are supplied subject to those conditions, which contain provisions limiting and
                excluding our liability and imposing time limits for claims. Nothing on this website varies them.
              </p>
            </Section>

            <Section title="6. Intellectual property">
              <p>
                The content of this site, including text, layout, graphics and the Navigator Sea Land name and
                marks, belongs to us or is used under licence. You may view and print pages for your own business
                purposes. You may not otherwise reproduce or republish them without our written consent.
              </p>
            </Section>

            <Section title="7. Liability for the website">
              <p>
                We take reasonable care over the content of this site but do not warrant that it is complete,
                accurate or current, or that the site will be available uninterrupted. To the extent permitted by
                law, we exclude liability for loss arising from reliance on the site&rsquo;s general content.
                Nothing here excludes liability that cannot lawfully be excluded.
              </p>
            </Section>

            <Section title="8. Links">
              <p>
                Where this site links to third-party sites, those links are for convenience. We do not control
                them and are not responsible for their content.
              </p>
            </Section>

            <Section title="9. Governing law">
              <p>
                These website terms are governed by [BRACKETED: state governing law — commonly the law of the
                Republic of Kazakhstan for the Almaty entity], and the courts of [BRACKETED: state jurisdiction]
                have exclusive jurisdiction. The governing law of a transport contract is that stated in the
                applicable trading conditions, which may differ.
              </p>
            </Section>

            <Section title="10. Contact">
              <p>
                Questions about these terms:{" "}
                <a href={`mailto:${company.email}`} className="text-accent-600 underline underline-offset-2">
                  {company.email}
                </a>
                .
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
      <div className="mt-3">{children}</div>
    </section>
  );
}
