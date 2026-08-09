import { useTranslation } from "react-i18next";
import { Badge } from "@/components/tailgrids/core/badge";

export function StatusBadge({ isActive }: { isActive: boolean; }) {
  const { t: translate } = useTranslation();

  return (
    <Badge
      color={isActive ? "success" : "error"}
      prefixIcon={
        <span className={`size-1.5 rounded-full ${isActive ? "bg-success-500" : "bg-error-500"}`} />
      }>
      {isActive ? translate('COMMON.STATUS.ACTIVE') : translate('COMMON.STATUS.INACTIVE')}
    </Badge>
  );
}
