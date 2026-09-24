// ---------------------------------------------------------------------------
// FAQs.
// General FAQ: Website Content — Final Copy Deck v2.0, section 10.5.
// Tracking-portal FAQ: functional help for /track, which the deck does not
// cover; kept because the portal is live.
// ---------------------------------------------------------------------------

import type { FaqItem } from "./types";

export const generalFaqs: FaqItem[] = [
  {
    question: "Where is Navigator Sea Land Limited based?",
    answer:
      "We are headquartered in Kazakhstan with offices in Almaty and Atyrau, supported by partner agents across China, the Caucasus, Türkiye, Iran, South Asia, the Gulf and Europe.",
  },
  {
    question: "What makes Navigator different from a global forwarder?",
    answer:
      "We specialise in complex cargo in Central Asia. Our own staff control the critical steps — engineering, permits, carriers and customs — on the ground, and decisions are made quickly by experienced management.",
  },
  {
    question: "Which countries do you cover?",
    answer:
      "All five Central Asian republics, Azerbaijan, Georgia, Türkiye, China, Iran, Pakistan, India, the GCC and Europe, with door-to-door capability.",
  },
  {
    question: "How quickly will I receive a quote?",
    answer:
      "Within one business day for most enquiries; complex project cargo may require a route survey before a firm quotation.",
  },
  {
    question: "Do you communicate in Russian?",
    answer: "Yes. Our team works in English, Russian and Kazakh.",
  },
];

export const trackingFaqs: FaqItem[] = [
  {
    question: "How do I track a shipment?",
    answer:
      "Enter your Tracking ID (format NSL-YYYY-NNNN) on the Track Shipment page, together with the consignee email address or the contract reference for the shipment. You will see the full checkpoint timeline, current status and estimated delivery date.",
  },
  {
    question: "Why does tracking ask for an email or contract reference?",
    answer:
      "Because project cargo carries commercial information — routes, counterparties, equipment specifications — that should not be visible to anyone who tries a sequential reference number. If you would prefer a particular shipment to be viewable with the Tracking ID alone, so that it can be shared with a site team, ask your Navigator Sea Land contact to open access on that shipment.",
  },
  {
    question: "How accurate are the estimated delivery dates?",
    answer:
      "They are estimates, and on a multimodal cross-border movement they should be read as such. Ferry sailings, wagon allocations, border processing and customs clearance all vary. We update the estimate as each leg is confirmed, and we record the reason on the timeline whenever a movement is delayed or placed on hold.",
  },
  {
    question: "What information do you need to quote?",
    answer:
      "Cargo drawings or dimensions (L × W × H), weight and centre of gravity, number of pieces, pick-up and delivery addresses, loading/unloading method, ready date and required delivery date. For dangerous goods, the Safety Data Sheet and UN number. Photos of the cargo and site access help greatly.",
  },
  {
    question: "Can you work as a subcontractor to another forwarder?",
    answer:
      "Yes. A significant part of our work is executing the Central Asian and Caspian legs for forwarders and project logistics companies whose own network stops at the region. We are used to working to another party's documentation and reporting requirements.",
  },
];
