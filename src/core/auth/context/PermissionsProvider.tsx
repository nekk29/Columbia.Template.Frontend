import { useMemo } from 'react';
import { environment } from '@/environments/environment';
import { PermissionsContext } from './PermissionsContext';
import { useUserPermissions } from '@/features/permissions/hooks/permissionsHooks';

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { data } = useUserPermissions(environment.application.code);

  const permissions: string[] = useMemo(() => {
    return (data?.data ?? []).map(p => p.actionCode);
  }, [data]);

  return (
    <PermissionsContext value={{ permissions }}>
      {children}
    </PermissionsContext>
  );
}
