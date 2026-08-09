import { usePermissions } from "@/core/auth/hooks/usePermissions";

export interface HasPermissionsProps {
  permissions: string[];
  children?: React.ReactNode;
}

export function HasPermissions({ permissions, children }: HasPermissionsProps) {
  const { permissions: userPermissions } = usePermissions();

  if (userPermissions.find(up => permissions.find(p => p == up)))
    return (<>{children}</>);

  return (<></>);
}
