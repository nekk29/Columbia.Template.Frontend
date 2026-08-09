import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { SearchParamsModel } from "@/models/base/query/SearchParamsModel";
import type { QueryResultsModel } from "@/models/base/query/QueryResultsModel";

import type { GetApplicationModel } from "@/features/applications/models/GetApplicationModel";
import type { ListApplicationModel } from "@/features/applications/models/ListApplicationModel";
import type { CreateApplicationModel } from "@/features/applications/models/CreateApplicationModel";
import type { UpdateApplicationModel } from "@/features/applications/models/UpdateApplicationModel";
import type { SearchApplicationModel } from "@/features/applications/models/SearchApplicationModel";
import type { SearchApplicationFilterModel } from "@/features/applications/models/SearchApplicationFilterModel";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunctionContext,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  createApplication,
  updateApplication,
  deleteApplication,
  getApplication,
  listApplications,
  searchApplications,
} from "@/features/applications/api/applicationsApi";

export const applicationKeys = {
  all: ["applications"] as const,
  get: (id: string) => ["applications", "get", id] as const,
  list: () => ["applications", "list"] as const,
  search: (body: SearchParamsModel<SearchApplicationFilterModel> | null) => ["applications", "search", body] as const,
};

export function useCreateApplication(
  options?: Omit<UseMutationOptions<ResponseDto<GetApplicationModel>, Error, CreateApplicationModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetApplicationModel>, Error, CreateApplicationModel>({
    mutationFn: createApplication,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useUpdateApplication(
  options?: Omit<UseMutationOptions<ResponseDto<GetApplicationModel>, Error, UpdateApplicationModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetApplicationModel>, Error, UpdateApplicationModel>({
    mutationFn: updateApplication,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useDeleteApplication(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseBaseDto, Error, string>({
    mutationFn: deleteApplication,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useGetApplication(
  id: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetApplicationModel>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetApplicationModel>, Error>({
    queryKey: applicationKeys.get(id),
    queryFn: () => getApplication(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useListApplications(
  options?: Omit<UseQueryOptions<ResponseDto<ListApplicationModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<ListApplicationModel[]>, Error>({
    queryKey: applicationKeys.list(),
    queryFn: () => listApplications(),
    enabled: Boolean(true),
    ...options,
  });
}

export function useSearchApplications(
  searchParams: SearchParamsModel<SearchApplicationFilterModel> | null,
  options?: Omit<UseQueryOptions<ResponseDto<QueryResultsModel<SearchApplicationModel>>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<QueryResultsModel<SearchApplicationModel>>, Error>({
    queryKey: applicationKeys.search(searchParams),
    queryFn: () => searchApplications(searchParams),
    enabled: Boolean(searchParams),
    ...options,
  });
}
