/**
 * Inline SVG icon set (Lucide-derived paths, MIT). Inlined rather than
 * installed so the site ships no icon-font request and every icon inherits
 * currentColor. Decorative by default; pass a `title` for meaningful icons.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Icon({ title, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      width="1em"
      height="1em"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const IconShip = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1" />
    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
    <path d="M12 10V2" />
  </Icon>
);

export const IconTrain = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="3" width="16" height="16" rx="2" />
    <path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3" />
    <circle cx="8.5" cy="15.5" r=".5" fill="currentColor" />
    <circle cx="15.5" cy="15.5" r=".5" fill="currentColor" />
  </Icon>
);

export const IconTruck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 18V6a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2" />
    <path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
    <path d="M9 18h6" />
  </Icon>
);

export const IconPlane = (p: IconProps) => (
  <Icon {...p}>
    <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a1 1 0 0 0-.9 1.7L8 11l-2 3H4l-1 2 3 1 1 3 2-1v-2l3-2 3.1 4.1a1 1 0 0 0 1.7-.9Z" />
  </Icon>
);

export const IconBarge = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 20c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1" />
    <path d="M4 17h16l1-5H3l1 5Z" />
    <path d="M7 12V8h4v4M14 12V6h4v6" />
  </Icon>
);

export const IconCrane = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 21h8M7 21V6M7 6h13M20 6l-3 4M7 6 4 3M13 6v5" />
    <rect x="10" y="11" width="6" height="4" rx="1" />
  </Icon>
);

export const IconRoute = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="19" r="3" />
    <circle cx="18" cy="5" r="3" />
    <path d="M9 19h4a3 3 0 0 0 3-3V8a3 3 0 0 1 3-3" transform="translate(-1 0)" />
  </Icon>
);

export const IconDocument = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M9 13h6M9 17h6" />
  </Icon>
);

export const IconClipboard = (p: IconProps) => (
  <Icon {...p}>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6M9 16h4" />
  </Icon>
);

export const IconWarehouse = (p: IconProps) => (
  <Icon {...p}>
    <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35a2 2 0 0 1 1.26-1.86l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
    <path d="M6 18h12v-6H6zM6 15h12" />
  </Icon>
);

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);

export const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

export const IconAlert = (p: IconProps) => (
  <Icon {...p}>
    <path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" />
    <path d="M12 9v4M12 17h.01" />
  </Icon>
);

export const IconClock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const IconPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

export const IconMail = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 6 10-6" />
  </Icon>
);

export const IconPhone = (p: IconProps) => (
  <Icon {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </Icon>
);

export const IconArrowRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const IconChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const IconMenu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

export const IconPackage = (p: IconProps) => (
  <Icon {...p}>
    <path d="m7.5 4.3 9 5.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="M3.3 7 12 12l8.7-5M12 22V12" />
  </Icon>
);

export const IconDashboard = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </Icon>
);

export const IconUsers = (p: IconProps) => (
  <Icon {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
  </Icon>
);

export const IconDownload = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </Icon>
);

export const IconPlus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const IconLogout = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </Icon>
);

export const IconGlobe = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </Icon>
);

export const IconPrinter = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" rx="1" />
  </Icon>
);

export const IconInbox = (p: IconProps) => (
  <Icon {...p}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1Z" />
  </Icon>
);



export const IconTruckHeavy = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 17V7h9v10M12 11h5l3 3v3" />
    <path d="M14 7h3l2 4" />
    <circle cx="6" cy="18" r="1.6" />
    <circle cx="10" cy="18" r="1.6" />
    <circle cx="18" cy="18" r="1.6" />
    <path d="M1 17h2M20 17h3" />
  </Icon>
);

export const IconTank = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="7" width="18" height="9" rx="4.5" />
    <path d="M7 16v3M17 16v3M5 19h14M12 7V5M10 5h4" />
  </Icon>
);

export const IconFlame = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22c4.4 0 7-2.8 7-6.5 0-3-2-5.5-3.5-7.5-.5 1.5-1.5 2.5-2.5 3-.3-3-1.7-6-4-8 .3 3-1 5-2.5 6.5C5 11 5 13.5 5 15.5 5 19.2 7.6 22 12 22Z" />
    <path d="M12 22c-1.7 0-3-1.3-3-3 0-1.6 1.2-2.6 2-3.5.5.8 1.5 1.2 2 1.5.8.7 2 1.4 2 2.5 0 1.4-1.3 2.5-3 2.5Z" />
  </Icon>
);

export const IconFlask = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 3h6M10 3v6.5L4.7 18.6A2 2 0 0 0 6.4 21.5h11.2a2 2 0 0 0 1.7-2.9L14 9.5V3" />
    <path d="M7.5 15h9" />
  </Icon>
);

export const IconPickaxe = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 10 4 20M14.5 5.5c3 0 5.5 2 7 4.5-2.5-1.5-5-2-8-1.5M14.5 5.5c-2.5-3-5.5-3.5-9-3 2.5 1.5 4.5 3.5 6 6.5" />
    <path d="m11.5 8.5 3 3" />
  </Icon>
);

export const IconWind = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 12v10M8 22h8" />
    <path d="M12 12 6.5 6.5M12 12l7.5-1.5M12 12l-2 7" />
    <circle cx="12" cy="12" r="1.5" />
  </Icon>
);

export const IconBolt = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H13l1-8.5Z" />
  </Icon>
);

export const IconHardhat = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 18h20M4 18v-3a8 8 0 0 1 16 0v3" />
    <path d="M10 7V5h4v2M10 10.5V7M14 10.5V7" />
  </Icon>
);

export const IconWheat = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22V10" />
    <path d="M12 10c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 10c3 0 5-2 5-5-3 0-5 2-5 5ZM12 15c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 15c3 0 5-2 5-5-3 0-5 2-5 5ZM12 20c-3 0-5-2-5-5 3 0 5 2 5 5ZM12 20c3 0 5-2 5-5-3 0-5 2-5 5Z" />
  </Icon>
);

export const IconShield = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const IconGauge = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 15a8 8 0 1 1 16 0" />
    <path d="M12 15l4-5M2 19h20" />
    <circle cx="12" cy="15" r="1.5" />
  </Icon>
);

export const IconMap = (p: IconProps) => (
  <Icon {...p}>
    <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" />
    <path d="M9 4v14M15 6v14" />
  </Icon>
);

export const IconCalculator = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01" />
  </Icon>
);

export const IconBriefcase = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20" />
  </Icon>
);

export const IconWhatsApp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 20.5 5 16A8.5 8.5 0 1 1 8.2 19.2L3.5 20.5Z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-1.9-1-1 .8a4 4 0 0 1-2.2-2.2l.8-1-1-1.9L9 9.5Z" />
  </Icon>
);

export const IconTarget = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </Icon>
);

export const IconLayers = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
  </Icon>
);

export const IconScale = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3v18M5 21h14M6 7h12" />
    <path d="m6 7-3 7a3 3 0 0 0 6 0L6 7ZM18 7l-3 7a3 3 0 0 0 6 0l-3-7Z" />
  </Icon>
);

export const IconThermometer = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0Z" />
    <path d="M12 9v8" />
  </Icon>
);

export const IconAnchor = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="5" r="2.5" />
    <path d="M12 7.5V22M5 12H2a10 10 0 0 0 20 0h-3" />
    <path d="M9 12h6" />
  </Icon>
);

export const IconHandshake = (p: IconProps) => (
  <Icon {...p}>
    <path d="m11 17 2 2a1 1 0 1 0 3-3M14 14l2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0L11 11.5a1.7 1.7 0 0 1-2.4-2.4L12 5.7a3 3 0 0 1 4.3 0L20 9.5" />
    <path d="m21 3-1 1M3 3l1 1M9 5.7 7 3.9M2 12l3 3" />
  </Icon>
);

export const IconLightbulb = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3v1h6v-1c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z" />
  </Icon>
);

export const IconRefresh = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 12a9 9 0 0 1 15.5-6.3L21 8" />
    <path d="M3 21v-5h5M21 3v5h-5" />
  </Icon>
);

export const IconEye = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const IconAward = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="6" />
    <path d="m8.5 13.5-1.5 8 5-3 5 3-1.5-8" />
  </Icon>
);

export const IconLeaf = (p: IconProps) => (
  <Icon {...p}>
    <path d="M11 20A7 7 0 0 1 4 13c0-6 5-10 16-11-1 11-5 15-9 18Z" />
    <path d="M4 20c3-4 6-7 12-11" />
  </Icon>
);

export const IconCompass = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </Icon>
);

export const IconExternal = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 3h7v7M21 3l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
  </Icon>
);

export const IconChevronRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const IconUpload = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </Icon>
);

/** Maps a mode key to its icon. */
export const MODE_ICONS = {
  ROAD: IconTruck,
  RAIL: IconTrain,
  SEA: IconShip,
  AIR: IconPlane,
  BARGE: IconBarge,
} as const;

/** Maps an `IconKey` from lib/content/types.ts to a component. */
export const CONTENT_ICONS = {
  clipboard: IconClipboard,
  crane: IconCrane,
  "truck-heavy": IconTruckHeavy,
  tank: IconTank,
  route: IconRoute,
  train: IconTrain,
  truck: IconTruck,
  ship: IconShip,
  plane: IconPlane,
  document: IconDocument,
  warehouse: IconWarehouse,
  flame: IconFlame,
  flask: IconFlask,
  pickaxe: IconPickaxe,
  wind: IconWind,
  bolt: IconBolt,
  hardhat: IconHardhat,
  wheat: IconWheat,
  shield: IconShield,
  gauge: IconGauge,
  users: IconUsers,
  clock: IconClock,
  pin: IconPin,
  map: IconMap,
  globe: IconGlobe,
  calculator: IconCalculator,
  file: IconDocument,
  briefcase: IconBriefcase,
  phone: IconPhone,
  whatsapp: IconWhatsApp,
  mail: IconMail,
  download: IconDownload,
  check: IconCheck,
  target: IconTarget,
  layers: IconLayers,
  scale: IconScale,
  thermometer: IconThermometer,
  box: IconPackage,
  anchor: IconAnchor,
  handshake: IconHandshake,
  lightbulb: IconLightbulb,
  refresh: IconRefresh,
  eye: IconEye,
  award: IconAward,
  leaf: IconLeaf,
  compass: IconCompass,
  search: IconSearch,
} as const;

export type ContentIconKey = keyof typeof CONTENT_ICONS;

export function ContentIcon({ name, className }: { name: ContentIconKey | undefined; className?: string }) {
  const Component = name ? CONTENT_ICONS[name] : IconCompass;
  return <Component className={className} />;
}
