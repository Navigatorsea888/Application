"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { EQUIPMENT_DISCLAIMER, EQUIPMENT_TABLES, getEquipmentTable, type EquipmentCategoryId } from "@/lib/tools/equipment";

/**
 * Container, trailer and rail-wagon reference tables. One category at a
 * time via a tab strip; data lives in lib/tools/equipment.
 */
export function EquipmentSpecs() {
  const [categoryId, setCategoryId] = useState<EquipmentCategoryId>("containers");
  const table = getEquipmentTable(categoryId);

  return (
    <div>
      <div role="tablist" aria-label="Equipment category" className="flex flex-wrap gap-2">
        {EQUIPMENT_TABLES.map((category) => {
          const selected = category.id === categoryId;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`equipment-tab-${category.id}`}
              aria-selected={selected}
              aria-controls={`equipment-panel-${category.id}`}
              onClick={() => setCategoryId(category.id)}
              className={`h-10 cursor-pointer rounded-md border px-4 font-[family-name:var(--font-display)] text-sm font-medium transition-colors duration-150 ${
                selected
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-300 bg-white text-ink-800 hover:border-ink-400 hover:bg-ink-100"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <Card className="mt-4 overflow-hidden">
        <div
          role="tabpanel"
          id={`equipment-panel-${table.id}`}
          aria-labelledby={`equipment-tab-${table.id}`}
          tabIndex={0}
        >
          <p className="border-b border-ink-200 px-5 py-3 text-sm text-ink-600">{table.note}</p>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Specification table (scrolls horizontally)">
            <table className="w-full min-w-[40rem] text-sm">
              <caption className="sr-only">{table.label}: typical dimensions and payloads</caption>
              <thead>
                <tr className="bg-ink-50 text-left text-xs text-ink-600">
                  <th scope="col" className="px-5 py-2.5 font-medium">Type</th>
                  {table.columns.map((column) => (
                    <th key={column.key} scope="col" className="px-4 py-2.5 font-medium">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.name} className="border-t border-ink-200 align-top">
                    <th scope="row" className="px-5 py-3 text-left font-[family-name:var(--font-display)] font-medium text-ink-900">
                      {row.name}
                    </th>
                    {table.columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 font-[family-name:var(--font-mono)] text-[0.8125rem] text-ink-700">
                        {row[column.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <p className="mt-4 text-xs leading-relaxed text-ink-600">{EQUIPMENT_DISCLAIMER}</p>
    </div>
  );
}
