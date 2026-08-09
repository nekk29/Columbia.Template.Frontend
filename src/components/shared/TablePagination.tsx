import "./TablePagination.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components/tailgrids/core/pagination";

import {
  Select,
  SelectContent,
  SelectIndicator,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/tailgrids/core/select";

export interface TablePaginationProps {
  total: number;
  page: number;
  pageSize: number;
  pageSizes?: number[];
  onPageChange?: (page: number, pageSize: number) => void;
}

export function TablePagination({ page, pageSize, pageSizes, total, onPageChange }: TablePaginationProps) {
  const { t: translate } = useTranslation();

  const [localPage, setLocalPage] = useState<number>(page);
  const [localPageSize, setLocalPageSize] = useState<number>(pageSize);
  const [localPageSizes] = useState<number[]>(pageSizes ?? [10, 25, 50, 100]);

  const totalPages = () => {
    return Math.ceil(total / (localPageSize ?? 1));
  }

  const startRecord = () => {
    return total === 0 ? 0 : (localPage - 1) * localPageSize + 1;
  }

  const endRecord = () => {
    const endIndex = localPage * localPageSize;
    return endIndex <= total ? endIndex : total;
  }

  const onPageParamsChange = (page: number, pageSize: number): void => {
    setLocalPage(page);
    setLocalPageSize(pageSize);

    if (onPageChange)
      onPageChange(page, pageSize);
  }

  return (
    <div className="table-pagination w-full flex items-center gap-4">
      <p className="text-gray-200 sm:text-sm/4">
        {translate('COMMON.PAGINATION.ROWS_PER_PAGE')}
      </p>
      <Select aria-label="Page Size"
        value={localPageSize} onChange={(pageSize) => { onPageParamsChange(localPage, pageSize) }}>
        <SelectTrigger>
          <SelectValue />
          <SelectIndicator />
        </SelectTrigger>
        <SelectContent>
          {localPageSizes && localPageSizes.map((ps) => (
            <SelectItem key={`pageSize-${ps}`} id={ps}>{ps}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-gray-200 sm:text-sm/4">
        {translate('COMMON.PAGINATION.ROWS_INFORMATION', {
          start: startRecord(),
          end: endRecord(),
          total: total
        })}
      </p>
      <Pagination
        variant="compact"
        sideLayout="icon"
        currentPage={localPage}
        totalPages={totalPages()}
        onPageChange={(page) => { onPageParamsChange(page, localPageSize) }}
      />
    </div>
  );
}
