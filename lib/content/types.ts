// ---------------------------------------------------------------------------
// Content model for the public site.
//
// Every marketing page is a hero plus an ordered list of blocks. The order of
// the array is the order of the sections on the page — which is how the copy
// deck asks for pages to be built ("exactly in the order the sections appear").
// ---------------------------------------------------------------------------

/** Keys resolved to inline SVG icons in components/icons.tsx. */
export type IconKey =
  | "clipboard"
  | "crane"
  | "truck-heavy"
  | "tank"
  | "route"
  | "train"
  | "truck"
  | "ship"
  | "plane"
  | "document"
  | "warehouse"
  | "flame"
  | "flask"
  | "pickaxe"
  | "wind"
  | "bolt"
  | "hardhat"
  | "wheat"
  | "shield"
  | "gauge"
  | "users"
  | "clock"
  | "pin"
  | "map"
  | "globe"
  | "calculator"
  | "file"
  | "briefcase"
  | "phone"
  | "whatsapp"
  | "mail"
  | "download"
  | "check"
  | "target"
  | "layers"
  | "scale"
  | "thermometer"
  | "box"
  | "anchor"
  | "handshake"
  | "lightbulb"
  | "refresh"
  | "eye"
  | "award"
  | "leaf"
  | "compass"
  | "search";

export type CtaVariant = "gold" | "primary" | "secondary" | "onDark";

export interface Cta {
  label: string;
  href: string;
  variant?: CtaVariant;
}

export interface CardItem {
  title: string;
  body: string;
  icon?: IconKey;
  href?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StepItem {
  title: string;
  body: string;
}

export interface RelatedLink {
  label: string;
  href: string;
  kind: "service" | "industry" | "corridor" | "page";
}

/**
 * An `[IMG]` instruction from the deck. No photography has been supplied yet,
 * so a hero renders its graphic treatment and this is recorded for the launch
 * checklist. When `src` is set the image is used.
 */
export interface ImageInstruction {
  instruction: string;
  alt: string;
  src?: string;
}

export interface Hero {
  title: string;
  lead: string;
  ctas: Cta[];
  image?: ImageInstruction;
}

export interface Meta {
  /** Exactly as written in the deck. Rendered without the site-wide template. */
  title: string;
  description: string;
  keywords: string[];
}

export type Block =
  | {
      type: "prose";
      id?: string;
      eyebrow?: string;
      heading?: string;
      /** Defaults to h2. */
      headingLevel?: 2 | 3;
      paragraphs: string[];
      cta?: Cta;
    }
  | {
      type: "cards";
      id?: string;
      eyebrow?: string;
      heading?: string;
      headingLevel?: 2 | 3;
      intro?: string;
      items: CardItem[];
      columns?: 2 | 3 | 4;
      cta?: Cta;
    }
  | {
      type: "table";
      id?: string;
      heading?: string;
      headingLevel?: 2 | 3;
      intro?: string;
      caption: string;
      columns: string[];
      rows: string[][];
      outro?: string;
    }
  | {
      type: "list";
      id?: string;
      heading?: string;
      headingLevel?: 2 | 3;
      intro?: string;
      items: string[];
      outro?: string;
      columns?: 1 | 2;
    }
  | {
      type: "steps";
      id?: string;
      eyebrow?: string;
      heading?: string;
      items: StepItem[];
    }
  | {
      type: "tags";
      id?: string;
      heading?: string;
      headingLevel?: 2 | 3;
      intro?: string;
      items: string[];
    }
  | {
      type: "faq";
      id?: string;
      heading?: string;
      items: FaqItem[];
    }
  | {
      type: "closing";
      id?: string;
      heading: string;
      body: string;
      ctas: Cta[];
    }
  | {
      type: "related";
      id?: string;
      heading?: string;
      links: RelatedLink[];
    }
  | {
      /**
       * A `[CONFIRM]` note from the deck: a fact, number or claim management
       * must verify before launch. Rendered as a gold review box on preview
       * builds only, never in production.
       */
      type: "confirm";
      title: string;
      body: string;
    };

export interface ContentPage {
  slug: string;
  path: string;
  /** Short label for menus and breadcrumbs. */
  title: string;
  /** One line for mega-menu panels and card grids. */
  summary: string;
  icon?: IconKey;
  meta: Meta;
  hero: Hero;
  blocks: Block[];
}

export interface ServicePage extends ContentPage {
  /** Key of QUOTE_SERVICE_TYPES that pre-selects the quote form. */
  quoteService: string;
  related: RelatedLink[];
  isNew?: boolean;
}

export interface IndustryPage extends ContentPage {
  cargo: string;
  related: RelatedLink[];
}

export interface CorridorPage extends ContentPage {
  route: string;
  bestFor: string;
  borderPoints: string[];
  /** ISO date the operational detail was last reviewed. Shown on the page. */
  reviewedOn: string;
  related: RelatedLink[];
}
