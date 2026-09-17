import "server-only";
import ExcelJS from "exceljs";

/**
 * Small wrapper over ExcelJS so both export routes produce consistent-looking
 * workbooks: a branded header row, frozen panes, sensible column widths and
 * an auto-filter, which is what makes the file usable rather than merely
 * downloadable.
 */
export interface Column {
  header: string;
  key: string;
  width?: number;
  /** Excel number format, e.g. "dd mmm yyyy" or "#,##0.00". */
  numFmt?: string;
}

export async function buildWorkbook(params: {
  sheetName: string;
  title: string;
  columns: Column[];
  rows: Array<Record<string, unknown>>;
}): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Navigator Sea Land Limited";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(params.sheetName, {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  // Title band
  sheet.mergeCells(1, 1, 1, Math.max(1, params.columns.length));
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = params.title;
  titleCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(1).height = 28;

  sheet.mergeCells(2, 1, 2, Math.max(1, params.columns.length));
  const subtitleCell = sheet.getCell(2, 1);
  subtitleCell.value = `Exported ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC · ${params.rows.length} row(s)`;
  subtitleCell.font = { name: "Calibri", size: 9, color: { argb: "FF64748B" } };
  subtitleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

  // Header row
  const headerRow = sheet.getRow(3);
  params.columns.forEach((column, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = column.header;
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF0F172A" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.border = { bottom: { style: "thin", color: { argb: "FFCBD5E1" } } };
  });
  headerRow.height = 22;

  sheet.columns = params.columns.map((column) => ({
    key: column.key,
    width: column.width ?? 18,
  }));

  for (const row of params.rows) {
    const added = sheet.addRow(row);
    added.font = { name: "Calibri", size: 10 };
    added.alignment = { vertical: "top" };
  }

  params.columns.forEach((column, index) => {
    if (column.numFmt) sheet.getColumn(index + 1).numFmt = column.numFmt;
  });

  if (params.rows.length > 0) {
    sheet.autoFilter = {
      from: { row: 3, column: 1 },
      to: { row: 3 + params.rows.length, column: params.columns.length },
    };
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

export function xlsxFilename(prefix: string): string {
  return `${prefix}-${new Date().toISOString().slice(0, 10)}.xlsx`;
}
