import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { SearchParamsModel } from "@/models/base/query/SearchParamsModel";
import type { QueryResultsModel } from "@/models/base/query/QueryResultsModel";

import type { GetRoleModel } from "@/features/roles/models/GetRoleModel";
import type { ListRoleModel } from "@/features/roles/models/ListRoleModel";
import type { CreateRoleModel } from "@/features/roles/models/CreateRoleModel";
import type { UpdateRoleModel } from "@/features/roles/models/UpdateRoleModel";
import type { SearchRoleModel } from "@/features/roles/models/SearchRoleModel";
import type { SearchRoleFilterModel } from "@/features/roles/models/SearchRoleFilterModel";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunctionContext,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  createRole,
  updateRole,
  deleteRole,
  getRole,
  listRoles,
  searchRoles,
} from "@/features/roles/api/rolesApi";

export const userKeys = {
  all: ["roles"] as const,
  get: (id: string) => ["roles", "get", id] as const,
  list: () => ["roles", "list"] as const,
  search: (body: SearchParamsModel<SearchRoleFilterModel>) => ["roles", "search", body] as const,
};

export function useCreateRole(
  options?: Omit<UseMutationOptions<ResponseDto<GetRoleModel>, Error, CreateRoleModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetRoleModel>, Error, CreateRoleModel>({
    mutationFn: createRole,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useUpdateRole(
  options?: Omit<UseMutationOptions<ResponseDto<GetRoleModel>, Error, UpdateRoleModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetRoleModel>, Error, UpdateRoleModel>({
    mutationFn: updateRole,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useDeleteRole(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseBaseDto, Error, string>({
    mutationFn: deleteRole,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useGetRole(
  id: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetRoleModel>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetRoleModel>, Error>({
    queryKey: userKeys.get(id),
    queryFn: () => getRole(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useListRoles(
  options?: Omit<UseQueryOptions<ResponseDto<ListRoleModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<ListRoleModel[]>, Error>({
    queryKey: userKeys.list(),
    queryFn: () => listRoles(),
    enabled: Boolean(true),
    ...options,
  });
}

export function useSearchRoles(
  searchParams: SearchParamsModel<SearchRoleFilterModel>,
  options?: Omit<UseQueryOptions<ResponseDto<QueryResultsModel<SearchRoleModel>>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<QueryResultsModel<SearchRoleModel>>, Error>({
    queryKey: userKeys.search(searchParams),
    queryFn: () => searchRoles(searchParams),
    enabled: Boolean(searchParams),
    ...options,
  });
}
