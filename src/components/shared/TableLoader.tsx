import {
  TableCell,
  TableRow
} from "@/components/tailgrids/core/table";
import { Skeleton } from "@/components/tailgrids/core/skeleton";

export function TableLoader({ colSpan }: { colSpan: number; }) {
  return (
    <TableRow className="text-sm border-b border-(--border-color-base-50) last:border-none">
      <TableCell className="text-center" colSpan={colSpan}>
        <div className="w-full flex flex-wrap justify-center p-2">
          <Skeleton className="h-1 w-1/2" />
        </div>
      </TableCell>
    </TableRow>
  );
}
