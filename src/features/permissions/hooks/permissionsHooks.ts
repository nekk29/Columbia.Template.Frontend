import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";

import type { PermissionModel } from "@/features/permissions/models/permissionModel";
import type { RolePermissionModel } from "@/features/permissions/models/rolePermissionModel";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunctionContext,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  assignPermissions,
  rolePermissions,
  userPermissions
} from "@/features/permissions/api/permissionsApi";

export const permissionKeys = {
  all: ["permissions"] as const,
  rolePermissions: (roleId: string) => ["permissions", "role", roleId] as const,
  userPermissions: (applicationCode: string) => ["permissions", "user", applicationCode] as const,
};

export function useAssignPermissions(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, { roleId: string; actionIds: string[] }>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseBaseDto, Error, { roleId: string; actionIds: string[] }>({
    mutationFn: ({ roleId, actionIds }) => assignPermissions(roleId, actionIds),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.all });
      queryClient.invalidateQueries({ queryKey: permissionKeys.rolePermissions(variables.roleId) });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useRolePermissions(
  roleId: string,
  options?: Omit<UseQueryOptions<ResponseDto<RolePermissionModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<RolePermissionModel[]>, Error>({
    queryKey: permissionKeys.rolePermissions(roleId),
    queryFn: () => rolePermissions(roleId),
    enabled: Boolean(roleId),
    ...options,
  });
}

export function useUserPermissions(
  applicationCode: string,
  options?: Omit<UseQueryOptions<ResponseDto<PermissionModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<PermissionModel[]>, Error>({
    queryKey: permissionKeys.userPermissions(applicationCode),
    queryFn: () => userPermissions(applicationCode),
    enabled: Boolean(applicationCode),
    ...options,
  });
}
