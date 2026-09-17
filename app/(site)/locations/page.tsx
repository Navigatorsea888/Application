import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { IconClock, IconMail, IconPhone, IconPin } from "@/components/icons";
import { offices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Navigator Sea Land offices in Almaty and Atyrau, Kazakhstan, and Mumbai, India — contact details and what each office handles.",
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Locations"
        title="Three offices, three corridors"
        lead="Each office exists because a corridor needed staff on it. Contact the office closest to the origin of your cargo, or write to operations and we will route it."
      />

      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {offices.map((office) => (
            <Card key={office.key} className="flex flex-col p-7">
              <p className="eyebrow">{office.role}</p>
              <h2 className="mt-2.5 text-xl">
                {office.city}
                <span className="ml-2 text-base font-normal text-ink-500">{office.country}</span>
              </h2>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">{office.description}</p>

              <dl className="mt-7 space-y-3.5 border-t border-ink-200 pt-6">
                <ContactRow icon={<IconPin className="size-4" />} label="Address">
                  {office.address}
                </ContactRow>
                <ContactRow icon={<IconPhone className="size-4" />} label="Phone">
                  {office.phone}
                </ContactRow>
                <ContactRow icon={<IconMail className="size-4" />} label="Email">
                  <a
                    href={`mailto:${office.email}`}
                    className="text-accent-600 underline underline-offset-2 hover:text-accent-700"
                  >
                    {office.email}
                  </a>
                </ContactRow>
                <ContactRow icon={<IconClock className="size-4" />} label="Hours">
                  {office.hours}
                </ContactRow>
              </dl>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-sm text-ink-500">
          Entries shown as <span className="font-mono">[VERIFY]</span> are placeholders. Replace them in{" "}
          <span className="font-mono">lib/content.ts</span> before publishing.
        </p>
      </div>
    </>
  );
}

/**
 * One term/description pair. The wrapping <div> is the only element a <dl> may
 * hold besides <dt>/<dd>, and it must contain the pair directly — so the icon
 * lives inside the <dt> rather than as a sibling.
 */
function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-500">
        <span className="shrink-0 text-ink-500" aria-hidden>
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-1 break-words pl-6 text-sm text-ink-800">{children}</dd>
    </div>
  );
}
