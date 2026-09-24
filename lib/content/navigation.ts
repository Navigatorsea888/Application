// ---------------------------------------------------------------------------
// Navigation — main menu with drop-down panels, header buttons, footer.
// Source: Website Content — Final Copy Deck v2.0, section 3.
// ---------------------------------------------------------------------------

import { about } from "./company";
import { corridors } from "./corridors";
import { industries } from "./industries";
import { services } from "./services";
import type { IconKey } from "./types";

export interface MenuLink {
  href: string;
  label: string;
  description?: string;
  icon?: IconKey;
  badge?: string;
}

export interface MenuItem {
  href: string;
  label: string;
  /** Drop-down panel entries. Absent = plain link. */
  children?: MenuLink[];
  /** Panel layout hint: "list" for text lists, "grid" for icon cards. */
  layout?: "list" | "grid";
}

const aboutChildren: MenuLink[] = [
  { href: "/about-us#who-we-are", label: "Who We Are" },
  { href: "/about-us#vision-mission-values", label: "Vision, Mission & Values" },
  ...(about.leadership.length ? [{ href: "/about-us#leadership", label: "Leadership" }] : []),
  { href: "/about-us#network-offices", label: "Network & Offices" },
  ...(about.accreditations.some((a) => a.held) ? [{ href: "/about-us#accreditations", label: "Accreditations" }] : []),
  { href: "/about-us#why-navigator", label: "Why Navigator" },
  { href: "/about-us#hsse-sustainability", label: "HSSE & Sustainability" },
];

export const mainMenu: MenuItem[] = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us", children: aboutChildren, layout: "list" },
  {
    href: "/services",
    label: "Services",
    layout: "grid",
    children: services.map((s) => ({
      href: s.path,
      label: s.title,
      description: s.summary,
      icon: s.icon,
      badge: s.isNew ? "New" : undefined,
    })),
  },
  {
    href: "/industries",
    label: "Industries",
    layout: "grid",
    children: industries.map((i) => ({ href: i.path, label: i.title, description: i.summary, icon: i.icon })),
  },
  {
    href: "/corridors",
    label: "Corridors",
    layout: "grid",
    children: corridors.map((c) => ({ href: c.path, label: c.title, description: c.summary, icon: c.icon })),
  },
  {
    href: "/projects",
    label: "Projects",
    layout: "list",
    children: [
      { href: "/projects", label: "Case Studies" },
      { href: "/projects#gallery", label: "Project Gallery" },
    ],
  },
  {
    href: "/insights",
    label: "Insights",
    layout: "list",
    children: [
      { href: "/insights", label: "News & Corridor Updates" },
      { href: "/insights/tools", label: "Tools (CBM Calculator, Incoterms Guide)" },
      { href: "/insights#downloads", label: "Downloads" },
    ],
  },
  {
    href: "/contact",
    label: "Contact",
    layout: "list",
    children: [
      { href: "/request-a-quote", label: "Request a Quote" },
      { href: "/contact#offices", label: "Offices" },
      { href: "/contact#operations-desk", label: "24/7 Operations" },
      { href: "/careers", label: "Careers" },
    ],
  },
];

export const headerButtons = {
  quote: { href: "/request-a-quote", label: "Request a Quote" },
  profile: { href: "/insights#downloads", label: "Company Profile" },
};

/** EN is live; RU and KZ follow (deck: "Russian and Kazakh versions to follow"). */
export const languages = [
  { code: "EN", iso: "en", label: "English", href: "/", available: true },
  { code: "RU", iso: "ru", label: "Русский", href: null, available: false },
  { code: "KZ", iso: "kk", label: "Қазақша", href: null, available: false },
] as const;

export const footerColumns = {
  company: [
    { href: "/about-us", label: "About Us" },
    { href: "/about-us#why-navigator", label: "Why Navigator" },
    { href: "/about-us#hsse-sustainability", label: "HSSE & Sustainability" },
    { href: "/projects", label: "Projects" },
    { href: "/insights", label: "Insights" },
    { href: "/careers", label: "Careers" },
    { href: "/track", label: "Track Shipment" },
  ],
  services: services.map((s) => ({ href: s.path, label: s.title })),
  industries: industries.map((i) => ({ href: i.path, label: i.title })),
  corridors: corridors.map((c) => ({ href: c.path, label: c.title })),
  legal: [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/faq", label: "FAQ" },
  ],
};
