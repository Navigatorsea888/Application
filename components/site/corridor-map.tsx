"use client";

import { useId, useMemo, useState } from "react";
import {
  AIR_LEGS,
  CORRIDOR_ORDER,
  GRATICULE,
  MAP_HEIGHT,
  MAP_NODES,
  MAP_ROUTES,
  MAP_WATER,
  MAP_WIDTH,
  MODE_COLORS,
  MODE_LABELS,
  legPath,
  project,
  resolveCorridorSlug,
  routeNodeLabels,
  waterPath,
  type CorridorSlug,
  type MapLeg,
  type MapNode,
  type TransportMode,
} from "@/lib/corridor-map-data";

const NAVY = "#0B2545";
const GREY = "#6B7689";
const WATER_FILL = "#EAF4F4";
const WATER_STROKE = "#AAD3D1";
const GOLD = MODE_COLORS.road;
const DASH = "0.012 0.008"; // unit-based: paths carry pathLength=1

export interface CorridorMapCorridor {
  slug: string;
  title: string;
  href: string;
  summary?: string;
}

export interface CorridorMapProps {
  corridors: ReadonlyArray<CorridorMapCorridor>;
  /** When set, only this corridor is highlighted and the selector list is hidden (used on corridor sub-pages). */
  activeSlug?: string;
  className?: string;
}

type Emphasis = "normal" | "hi" | "dim";

export function CorridorMap({ corridors, activeSlug, className }: CorridorMapProps) {
  const [selected, setSelected] = useState<string | undefined>(activeSlug);
  const titleId = useId();
  const descId = useId();
  const highlight = resolveCorridorSlug(selected);
  const showList = !activeSlug;

  const description = useMemo(() => {
    const titleFor = (slug: CorridorSlug) =>
      corridors.find((c) => resolveCorridorSlug(c.slug) === slug)?.title ?? slug;
    return CORRIDOR_ORDER.map((slug) => `${titleFor(slug)}: ${routeNodeLabels(slug).join(" – ")}`).join(
      ". ",
    );
  }, [corridors]);

  const emphasisFor = (slug: CorridorSlug): Emphasis =>
    !highlight ? "normal" : slug === highlight ? "hi" : "dim";

  // Highlighted corridor renders last so it sits above the dimmed network.
  const orderedRoutes = [...CORRIDOR_ORDER].sort((a, b) => Number(a === highlight) - Number(b === highlight));

  return (
    <div className={`reveal ${className ?? ""}`.trim()}>
      <div
        className={
          showList ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start" : "grid gap-4"
        }
      >
        <div>
          <div className="overflow-hidden rounded-xl border border-ink-200 bg-white p-2 shadow-sm">
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              role="img"
              aria-labelledby={`${titleId} ${descId}`}
              className="block h-auto w-full"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <title id={titleId}>Navigator Sea Land corridor network map</title>
              <desc id={descId}>
                Schematic map of Eurasia from Europe to eastern China showing the freight corridors Navigator
                Sea Land operates, with offices in Almaty and Atyrau. {description}. Air links: Europe to
                Almaty and Jebel Ali to Atyrau.
              </desc>

              <rect width={MAP_WIDTH} height={MAP_HEIGHT} rx={12} fill="#F6F8FB" />

              {/* Graticule */}
              <g stroke="#DFE5EE" strokeWidth={0.75} fill="none">
                {GRATICULE.meridians.map((x) => (
                  <line key={`m${x}`} x1={x} x2={x} y1={0} y2={MAP_HEIGHT} />
                ))}
                {GRATICULE.parallels.map((y) => (
                  <line key={`p${y}`} x1={0} x2={MAP_WIDTH} y1={y} y2={y} />
                ))}
              </g>

              {/* Water bodies for orientation */}
              <g fill={WATER_FILL} stroke={WATER_STROKE} strokeWidth={1}>
                {MAP_WATER.map((body) => (
                  <path key={body.id} d={waterPath(body)} />
                ))}
              </g>
              <g fill={GREY} fontSize={11} fontStyle="italic" textAnchor="middle" pointerEvents="none">
                {MAP_WATER.map((body) => {
                  const p = project(body.labelAt[0], body.labelAt[1]);
                  return (
                    <text key={body.id} x={p.x} y={p.y}>
                      {body.label}
                    </text>
                  );
                })}
              </g>

              {/* Air links: always faint, never tied to a corridor */}
              <g fill="none" stroke={MODE_COLORS.air} strokeWidth={1.5} strokeDasharray={DASH} opacity={0.8}>
                {AIR_LEGS.map((leg) => (
                  <path key={`${leg.from}-${leg.to}`} d={legPath(leg)} pathLength={1} />
                ))}
              </g>

              {/* Corridor routes */}
              {orderedRoutes.map((slug) => {
                const emphasis = emphasisFor(slug);
                return (
                  <g
                    key={slug}
                    fill="none"
                    strokeLinecap="round"
                    strokeWidth={emphasis === "hi" ? 3 : 2}
                    opacity={emphasis === "dim" ? 0.35 : 1}
                    style={{ transition: "opacity 300ms ease, stroke-width 300ms ease" }}
                  >
                    {MAP_ROUTES[slug].legs.map((leg) => (
                      <RouteLeg key={`${leg.from}-${leg.to}-${leg.mode}`} leg={leg} />
                    ))}
                  </g>
                );
              })}

              {/* Nodes and labels */}
              <g>
                {MAP_NODES.map((node) => (
                  <NodeMark key={node.id} node={node} />
                ))}
              </g>
            </svg>
          </div>
          <Legend />
        </div>

        {showList ? (
          <ul className="flex flex-col gap-2" aria-label="Corridors">
            {corridors.map((corridor) => {
              const slug = resolveCorridorSlug(corridor.slug);
              const color = slug ? MODE_COLORS[MAP_ROUTES[slug].accent] : NAVY;
              const isSelected = selected === corridor.slug;
              return (
                <li key={corridor.slug}>
                  <a
                    href={corridor.href}
                    onMouseEnter={() => setSelected(corridor.slug)}
                    onFocus={() => setSelected(corridor.slug)}
                    aria-current={isSelected ? "true" : undefined}
                    className={`relative block rounded-lg border bg-white py-3 pr-3 pl-4 shadow-sm transition-colors hover:border-accent-200 ${
                      isSelected ? "border-accent-600" : "border-ink-200"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-2 bottom-2 left-0 w-1 rounded-r transition-opacity"
                      style={{ backgroundColor: color, opacity: isSelected ? 1 : 0 }}
                    />
                    <span className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                      {corridor.title}
                    </span>
                    {corridor.summary ? (
                      <span className="mt-1 block text-xs leading-relaxed text-ink-500">{corridor.summary}</span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function RouteLeg({ leg }: { leg: MapLeg }) {
  // Dashed legs cannot also use the dash-based draw animation, so they fade in with the reveal instead.
  if (leg.dashed) {
    return <path d={legPath(leg)} pathLength={1} stroke={MODE_COLORS[leg.mode]} strokeDasharray={DASH} opacity={0.6} />;
  }
  return <path d={legPath(leg)} pathLength={1} stroke={MODE_COLORS[leg.mode]} className="draw-path" />;
}

function NodeMark({ node }: { node: MapNode }) {
  const { x, y } = project(node.lon, node.lat);
  const isOffice = node.kind === "office";
  return (
    <g>
      <NodeGlyph kind={node.kind} x={x} y={y} />
      <text
        x={x + (node.dx ?? 9)}
        y={y + (node.dy ?? 4)}
        textAnchor={node.anchor ?? "start"}
        fontSize={11}
        fontWeight={isOffice || node.kind === "hub" ? 700 : 500}
        fill={NAVY}
        stroke="#FFFFFF"
        strokeWidth={3}
        strokeLinejoin="round"
        style={{ paintOrder: "stroke" }}
      >
        {node.label}
      </text>
    </g>
  );
}

function NodeGlyph({ kind, x, y }: { kind: MapNode["kind"]; x: number; y: number }) {
  switch (kind) {
    case "office":
      return (
        <g>
          <circle cx={x} cy={y} r={9} fill={NAVY} stroke={GOLD} strokeWidth={2.5} />
          <circle cx={x} cy={y} r={3} fill="#FFFFFF" />
        </g>
      );
    case "port":
      return <rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill={NAVY} stroke="#FFFFFF" strokeWidth={1} transform={`rotate(45 ${x} ${y})`} />;
    case "border":
      return <rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill="#FFFFFF" stroke={GREY} strokeWidth={1.5} transform={`rotate(45 ${x} ${y})`} />;
    case "hub":
      return <circle cx={x} cy={y} r={4.5} fill={NAVY} stroke="#FFFFFF" strokeWidth={1.5} />;
    default:
      return <circle cx={x} cy={y} r={3.5} fill="#FFFFFF" stroke={NAVY} strokeWidth={1.5} />;
  }
}

function Legend() {
  const modes: TransportMode[] = ["rail", "road", "sea", "air"];
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-500" aria-label="Map legend">
      {modes.map((mode) => (
        <li key={mode} className="flex items-center gap-2">
          <svg width={28} height={10} aria-hidden="true">
            <line x1={1} x2={27} y1={5} y2={5} stroke={MODE_COLORS[mode]} strokeWidth={mode === "air" ? 1.5 : 3} strokeLinecap="round" strokeDasharray={mode === "air" ? "4 3" : undefined} />
          </svg>
          {mode === "air" ? "Air (dashed)" : MODE_LABELS[mode]}
        </li>
      ))}
      <li className="flex items-center gap-2">
        <svg width={22} height={22} aria-hidden="true"><NodeGlyph kind="office" x={11} y={11} /></svg>
        Office
      </li>
      <li className="flex items-center gap-2">
        <svg width={14} height={14} aria-hidden="true"><NodeGlyph kind="port" x={7} y={7} /></svg>
        Port
      </li>
      <li className="flex items-center gap-2">
        <svg width={14} height={14} aria-hidden="true"><NodeGlyph kind="border" x={7} y={7} /></svg>
        Border crossing
      </li>
    </ul>
  );
}
