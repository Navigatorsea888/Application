import type { Metadata } from "next";
import { Alert } from "@/components/ui";
import { PageHero } from "@/components/site/page-hero";
import { company, confirmedOr } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy | Navigator Sea Land Limited",
  description: "How Navigator Sea Land Limited collects, uses and protects personal data.",
};

const LAST_UPDATED = "17 September 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" lead={`Last updated: ${LAST_UPDATED}`} />

      <div className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Alert tone="warning" title="Review required before publication">
            This policy is a working draft prepared for a logistics operator handling personal data across
            Kazakhstan and, where clients are EU-based, the EU. It has not been reviewed by a lawyer.
            Have qualified counsel confirm it against the Kazakh Personal Data Law and the GDPR before it is published, and complete every bracketed item.
          </Alert>

          <div className="prose-body mt-10 space-y-8">
            <Section title="1. Who we are">
              <p>
                {company.legalName} (&ldquo;Navigator Sea Land&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a
                project freight forwarder with offices in Almaty and Atyrau, Kazakhstan. We are
                the controller of the personal data described in this policy.
              </p>
              <p>
                Data protection enquiries: <a href={`mailto:${company.email}`} className="text-accent-600 underline underline-offset-2">{company.email}</a>.
                Registered address and company number: {confirmedOr(company.registration, "available on request")}.
              </p>
            </Section>

            <Section title="2. What we collect">
              <p>We collect personal data in three situations.</p>
              <p>
                <strong>When you contact us or request a quote.</strong> Your name, company, email address,
                telephone number, country, and whatever you tell us about the cargo and the movement.
              </p>
              <p>
                <strong>When you track a shipment.</strong> The Tracking ID and the verification value you enter,
                together with your IP address, which we log for the limited purpose of rate-limiting the form
                against automated guessing.
              </p>
              <p>
                <strong>When we handle a shipment for you.</strong> Contact details for the shipper, consignee and
                billing party, which we hold as part of the transport record and which appear on transport
                documents.
              </p>
            </Section>

            <Section title="3. Why we use it, and on what basis">
              <p>
                We use contact and cargo information to respond to enquiries, prepare quotations, perform transport
                contracts, and keep you informed of the progress of a shipment. Where you are a party to a
                contract with us, our basis is performance of that contract. Where you are an enquirer, our basis
                is our legitimate interest in responding to you.
              </p>
              <p>
                We use tracking form logs to protect shipment data from unauthorised access. Our basis is our
                legitimate interest, and that of our clients, in keeping commercially sensitive movement details
                confidential.
              </p>
              <p>
                We retain transport and customs records to meet statutory retention obligations in the
                jurisdictions we operate in. Our basis is compliance with a legal obligation.
              </p>
            </Section>

            <Section title="4. Who we share it with">
              <p>
                Executing a movement requires sharing data with the parties who perform it: carriers, shipping
                lines, rail operators, ports and terminals, customs brokers, agents and authorities. We share only
                what each party needs.
              </p>
              <p>
                We also use service providers for email delivery and hosting. [BRACKETED: list your hosting
                provider, email provider and any tracking or analytics tools, with the countries they process in.]
              </p>
              <p>We do not sell personal data, and we do not use it for advertising.</p>
            </Section>

            <Section title="5. International transfers">
              <p>
                Corridor movements are international by nature, and data is transferred between our offices and to
                parties in the countries a movement passes through. Where data originating in the EU or the UK is
                transferred outside it, we rely on [BRACKETED: state your transfer mechanism — standard
                contractual clauses, adequacy, or derogation for contract performance].
              </p>
            </Section>

            <Section title="6. How long we keep it">
              <p>
                Enquiries and quotations that do not become bookings: [BRACKETED: state period, commonly 24
                months]. Transport, customs and accounting records: for the statutory retention period applicable
                in the jurisdiction concerned [BRACKETED: confirm periods for Kazakhstan]. Tracking form
                logs: 24 hours, after which they are deleted automatically.
              </p>
            </Section>

            <Section title="7. Your rights">
              <p>
                Subject to the law that applies to you, you may request access to your personal data, correction
                of inaccurate data, erasure, restriction of processing, portability, or you may object to
                processing based on legitimate interests. Write to{" "}
                <a href={`mailto:${company.email}`} className="text-accent-600 underline underline-offset-2">{company.email}</a>.
              </p>
              <p>
                We will respond within the period the applicable law allows. You may also complain to your
                supervisory authority.
              </p>
            </Section>

            <Section title="8. Cookies">
              <p>
                This website sets one cookie, and only for staff: a session cookie that keeps a signed-in
                administrator signed in. It is strictly necessary, and it is not set for public visitors.
              </p>
              <p>
                [BRACKETED: If analytics, advertising or embedded media are added later, this section must be
                updated and a consent mechanism added before those cookies are set.]
              </p>
            </Section>

            <Section title="9. Security">
              <p>
                Access to shipment records is restricted to authorised staff, authenticated individually and
                assigned a role that limits what they may do. Passwords are stored hashed. Shipment tracking
                requires a second identifier in addition to the Tracking ID unless a shipment has been explicitly
                opened for public viewing at a client&rsquo;s request.
              </p>
            </Section>

            <Section title="10. Changes">
              <p>
                We will post any change to this policy on this page and update the date at the top. Material
                changes will be notified to clients directly.
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
