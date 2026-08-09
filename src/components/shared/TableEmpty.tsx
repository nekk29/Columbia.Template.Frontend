import { useTranslation } from "react-i18next";
import {
  TableCell,
  TableRow
} from "@/components/tailgrids/core/table";

export function TableEmpty({ colSpan }: { colSpan: number; }) {
  const { t: translate } = useTranslation();

  return (
    <TableRow className="text-sm border-b border-(--border-color-base-50) last:border-none">
      <TableCell className="text-center" colSpan={colSpan}>
        {translate('COMMON.MESSAGES.SEARCH.NO_RESULTS')}
      </TableCell>
    </TableRow>
  );
}
