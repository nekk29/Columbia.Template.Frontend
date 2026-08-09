import { useContext } from "react";
import { PERMISSIONS } from "@/core/auth/permissions/permissions";
import { PermissionsContext } from "@/core/auth/context/PermissionsContext";

export function usePermissions() {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }

  return context;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePermissionsModule(module: string): { PERMISSIONS: any } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const permissions = (PERMISSIONS as any)[module];
  return { PERMISSIONS: permissions };
}
