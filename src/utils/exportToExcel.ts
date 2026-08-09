/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TableColumn } from '@/models/shared/TableColumn';
import * as XLSX from 'xlsx';

export interface ColumnInfo {
  field: string;
  header: string;
}

export interface ExportParams<T> {
  items: T[];
  columns: TableColumn<T>[];
  fileName: string;
  sheetName: string;
  translate: (value: string) => string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function exportToExcel<T>({
  items,
  columns,
  fileName,
  sheetName,
  translate,
  onSuccess,
  onError
}: ExportParams<T>) {
  try {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    const columnInfo: Map<string, string> = new Map([]);

    for (const column of columns) {
      for (const [key, value] of (column.exportFields ?? [])) {
        columnInfo.set(key, value);
      }
    }

    const headers = [...columnInfo.values()];

    const translatedItems = items.length === 0 ? [] : items.map(item => {
      const baseItem = item as any;
      const newItem = {} as any;

      for (const [key] of (columnInfo ?? [])) {
        if (key === "isActive") {
          newItem[key] = baseItem[key]
            ? translate('COMMON.STATUS.ACTIVE')
            : translate('COMMON.STATUS.INACTIVE');
        }
        else {
          newItem[key] = baseItem[key];
        }
      }

      return newItem;
    });

    XLSX.utils.sheet_add_aoa(ws, [headers]);
    XLSX.utils.sheet_add_json(ws, translatedItems, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, `${fileName}.xlsx`);

    if (onSuccess) onSuccess();
  }
  catch (error) {
    if (onError) onError(error);
  }
};
