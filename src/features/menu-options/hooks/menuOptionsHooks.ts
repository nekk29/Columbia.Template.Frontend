import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";

import type { GetMenuOptionModel } from "@/features/menu-options/models/getMenuOptionModel";
import type { CreateMenuOptionModel } from "@/features/menu-options/models/createMenuOptionModel";
import type { UpdateMenuOptionModel } from "@/features/menu-options/models/updateMenuOptionModel";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunctionContext,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  createMenuOption,
  updateMenuOption,
  deleteMenuOption,
  getMenuOption,
  listMenuOptions,
  listAllMenuOptions,
  listTreeMenuOptions,
  listTreeAllMenuOptions,
} from "@/features/menu-options/api/menuOptionsApi";

export const menuOptionKeys = {
  all: ["menu-options"] as const,
  get: (id: string) => ["menu-options", "get", id] as const,
  list: (applicationCode: string) => ["menu-options", "list", applicationCode] as const,
  listAll: (applicationCode: string) => ["menu-options", "list-all", applicationCode] as const,
  tree: (applicationCode: string) => ["menu-options", "tree", applicationCode] as const,
  treeAll: (applicationCode: string) => ["menu-options", "tree-all", applicationCode] as const,
};

export function useCreateMenuOption(
  options?: Omit<UseMutationOptions<ResponseDto<GetMenuOptionModel>, Error, CreateMenuOptionModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetMenuOptionModel>, Error, CreateMenuOptionModel>({
    mutationFn: createMenuOption,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: menuOptionKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useUpdateMenuOption(
  options?: Omit<UseMutationOptions<ResponseDto<GetMenuOptionModel>, Error, UpdateMenuOptionModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetMenuOptionModel>, Error, UpdateMenuOptionModel>({
    mutationFn: updateMenuOption,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: menuOptionKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useDeleteMenuOption(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseBaseDto, Error, string>({
    mutationFn: deleteMenuOption,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: menuOptionKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useGetMenuOption(
  id: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetMenuOptionModel>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetMenuOptionModel>, Error>({
    queryKey: menuOptionKeys.get(id),
    queryFn: () => getMenuOption(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useListMenuOptions(
  applicationCode: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetMenuOptionModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetMenuOptionModel[]>, Error>({
    queryKey: menuOptionKeys.list(applicationCode),
    queryFn: () => listMenuOptions(applicationCode),
    enabled: Boolean(applicationCode),
    ...options,
  });
}

export function useListAllMenuOptions(
  applicationCode: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetMenuOptionModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetMenuOptionModel[]>, Error>({
    queryKey: menuOptionKeys.listAll(applicationCode),
    queryFn: () => listAllMenuOptions(applicationCode),
    enabled: Boolean(applicationCode),
    ...options,
  });
}

export function useListTreeMenuOptions(
  applicationCode: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetMenuOptionModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetMenuOptionModel[]>, Error>({
    queryKey: menuOptionKeys.tree(applicationCode),
    queryFn: () => listTreeMenuOptions(applicationCode),
    enabled: Boolean(applicationCode),
    ...options,
  });
}

export function useListTreeAllMenuOptions(
  applicationCode: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetMenuOptionModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetMenuOptionModel[]>, Error>({
    queryKey: menuOptionKeys.treeAll(applicationCode),
    queryFn: () => listTreeAllMenuOptions(applicationCode),
    enabled: Boolean(applicationCode),
    ...options,
  });
}
