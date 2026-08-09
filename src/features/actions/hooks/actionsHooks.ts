import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";

import type { GetActionModel } from "@/features/actions/models/GetActionModel";
import type { ListActionModel } from "@/features/actions/models/ListActionModel";
import type { CreateActionModel } from "@/features/actions/models/CreateActionModel";
import type { UpdateActionModel } from "@/features/actions/models/UpdateActionModel";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunctionContext,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  createAction,
  updateAction,
  deleteAction,
  getAction,
  listActions,
  listActionsByModule,
} from "@/features/actions/api/actionsApi";

export const actionKeys = {
  all: ["actions"] as const,
  get: (id: string) => ["actions", "get", id] as const,
  list: () => ["actions", "list"] as const,
  listByModule: (moduleId: string) => ["actions", "list", "module", moduleId] as const,
};

export function useCreateAction(
  options?: Omit<UseMutationOptions<ResponseDto<GetActionModel>, Error, CreateActionModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetActionModel>, Error, CreateActionModel>({
    mutationFn: createAction,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: actionKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useUpdateAction(
  options?: Omit<UseMutationOptions<ResponseDto<GetActionModel>, Error, UpdateActionModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetActionModel>, Error, UpdateActionModel>({
    mutationFn: updateAction,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: actionKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useDeleteAction(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseBaseDto, Error, string>({
    mutationFn: deleteAction,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: actionKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useGetAction(
  id: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetActionModel>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetActionModel>, Error>({
    queryKey: actionKeys.get(id),
    queryFn: () => getAction(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useListActions(
  options?: Omit<UseQueryOptions<ResponseDto<ListActionModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<ListActionModel[]>, Error>({
    queryKey: actionKeys.list(),
    queryFn: () => listActions(),
    enabled: Boolean(true),
    ...options,
  });
}

export function useListActionsByModule(
  moduleId: string,
  options?: Omit<UseQueryOptions<ResponseDto<ListActionModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<ListActionModel[]>, Error>({
    queryKey: actionKeys.listByModule(moduleId),
    queryFn: () => listActionsByModule(moduleId),
    enabled: Boolean(moduleId),
    ...options,
  });
}
