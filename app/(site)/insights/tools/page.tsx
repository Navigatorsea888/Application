import type { Metadata } from "next";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { CbmCalculator } from "@/components/tools/cbm-calculator";
import { OogPrecheck } from "@/components/tools/oog-precheck";
import { IncotermsGuide } from "@/components/tools/incoterms-guide";
import { EquipmentSpecs } from "@/components/tools/equipment-specs";
import { toolsPage } from "@/lib/content";

export const metadata: Metadata = {
  title: toolsPage.meta.title,
  description: toolsPage.meta.description,
  keywords: toolsPage.meta.keywords,
  alternates: { canonical: "/insights/tools" },
};

export default function ToolsPage() {
  return (
    <>
      <HeroBanner
        hero={toolsPage.hero}
        crumbs={[
          { label: "Insights", href: "/insights" },
          { label: "Tools", href: "/insights/tools" },
        ]}
        eyebrow="Insights · Tools"
      >
        <nav aria-label="Tools on this page" className="mt-8 flex flex-wrap gap-2">
          {[
            ["#cbm-calculator", "CBM & Chargeable Weight"],
            ["#oog-precheck", "OOG Pre-Check"],
            ["#incoterms", "Incoterms® 2020"],
            ["#equipment-specs", "Equipment Specs"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-md border border-white/30 px-3 py-1.5 text-sm text-white transition-colors duration-150 hover:border-gold-300 hover:text-gold-300"
            >
              {label}
            </a>
          ))}
        </nav>
      </HeroBanner>

      <Band alt={false} id="cbm-calculator">
        <div className="max-w-3xl">
          <p className="eyebrow">Tool 1</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">CBM & Chargeable Weight Calculator</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">
            Enter dimensions and weight; outputs CBM and air/sea chargeable weight.
          </p>
        </div>
        <div className="mt-8">
          <CbmCalculator />
        </div>
      </Band>

      <Band alt id="oog-precheck">
        <div className="max-w-3xl">
          <p className="eyebrow">Tool 2</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">OOG Pre-Check</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">
            Enter L×W×H and weight; the tool flags whether the cargo is likely out-of-gauge and prompts an engineer call-back.
          </p>
        </div>
        <div className="mt-8">
          <OogPrecheck />
        </div>
      </Band>

      <Band alt={false} id="incoterms">
        <div className="max-w-3xl">
          <p className="eyebrow">Tool 3</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">Incoterms® 2020 Guide</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">
            Who pays and who carries risk for each term. Print the page or save it as a PDF.
          </p>
        </div>
        <div className="mt-8">
          <IncotermsGuide />
        </div>
      </Band>

      <Band alt id="equipment-specs">
        <div className="max-w-3xl">
          <p className="eyebrow">Tool 4</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">Container & Equipment Specs</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">
            Dimensions and payloads of containers, flat racks, trailers and rail wagons.
          </p>
        </div>
        <div className="mt-8">
          <EquipmentSpecs />
        </div>
      </Band>

      <ClosingCta />
    </>
  );
}
