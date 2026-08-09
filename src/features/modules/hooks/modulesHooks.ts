import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { SearchParamsModel } from "@/models/base/query/SearchParamsModel";
import type { QueryResultsModel } from "@/models/base/query/QueryResultsModel";

import type { GetModuleModel } from "@/features/modules/models/GetModuleModel";
import type { ListModuleModel } from "@/features/modules/models/ListModuleModel";
import type { CreateModuleModel } from "@/features/modules/models/CreateModuleModel";
import type { UpdateModuleModel } from "@/features/modules/models/UpdateModuleModel";
import type { SearchModuleModel } from "@/features/modules/models/SearchModuleModel";
import type { SearchModuleFilterModel } from "@/features/modules/models/SearchModuleFilterModel";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunctionContext,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  createModule,
  updateModule,
  deleteModule,
  getModule,
  listModules,
  listModulesByApplication,
  listSimpleModulesByApplication,
  searchModules,
} from "@/features/modules/api/modulesApi";

export const moduleKeys = {
  all: ["modules"] as const,
  get: (id: string) => ["modules", "get", id] as const,
  list: () => ["modules", "list"] as const,
  listByApplication: (applicationId: string) => ["modules", "list", "application", applicationId] as const,
  listSimpleByApplication: (applicationId: string) => ["modules", "list-simple", "application", applicationId] as const,
  search: (body: SearchParamsModel<SearchModuleFilterModel> | null) => ["modules", "search", body] as const,
};

export function useCreateModule(
  options?: Omit<UseMutationOptions<ResponseDto<GetModuleModel>, Error, CreateModuleModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetModuleModel>, Error, CreateModuleModel>({
    mutationFn: createModule,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useUpdateModule(
  options?: Omit<UseMutationOptions<ResponseDto<GetModuleModel>, Error, UpdateModuleModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetModuleModel>, Error, UpdateModuleModel>({
    mutationFn: updateModule,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useDeleteModule(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseBaseDto, Error, string>({
    mutationFn: deleteModule,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useGetModule(
  id: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetModuleModel>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetModuleModel>, Error>({
    queryKey: moduleKeys.get(id),
    queryFn: () => getModule(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useListModules(
  options?: Omit<UseQueryOptions<ResponseDto<ListModuleModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<ListModuleModel[]>, Error>({
    queryKey: moduleKeys.list(),
    queryFn: () => listModules(),
    enabled: Boolean(true),
    ...options,
  });
}

export function useListModulesByApplication(
  applicationId: string,
  options?: Omit<UseQueryOptions<ResponseDto<ListModuleModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<ListModuleModel[]>, Error>({
    queryKey: moduleKeys.listByApplication(applicationId),
    queryFn: () => listModulesByApplication(applicationId),
    enabled: Boolean(applicationId),
    ...options,
  });
}

export function useListSimpleModulesByApplication(
  applicationId: string,
  options?: Omit<UseQueryOptions<ResponseDto<ListModuleModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<ListModuleModel[]>, Error>({
    queryKey: moduleKeys.listSimpleByApplication(applicationId),
    queryFn: () => listSimpleModulesByApplication(applicationId),
    enabled: Boolean(applicationId),
    ...options,
  });
}

export function useSearchModules(
  searchParams: SearchParamsModel<SearchModuleFilterModel> | null,
  options?: Omit<UseQueryOptions<ResponseDto<QueryResultsModel<SearchModuleModel>>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<QueryResultsModel<SearchModuleModel>>, Error>({
    queryKey: moduleKeys.search(searchParams),
    queryFn: () => searchModules(searchParams),
    enabled: Boolean(searchParams),
    ...options,
  });
}
