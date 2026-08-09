import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { QueryResultsModel } from "@/models/base/query/QueryResultsModel";
import type { SearchParamsModel } from "@/models/base/query/SearchParamsModel";

import type { CreateSettingModel } from "@/features/settings/models/CreateSettingModel";
import type { GetSettingModel } from "@/features/settings/models/GetSettingModel";
import type { ListSettingModel } from "@/features/settings/models/ListSettingModel";
import type { SearchSettingFilterModel } from "@/features/settings/models/SearchSettingFilterModel";
import type { SearchSettingModel } from "@/features/settings/models/SearchSettingModel";
import type { UpdateSettingModel } from "@/features/settings/models/UpdateSettingModel";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunctionContext,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  createSetting,
  deleteSetting,
  getSetting,
  listSettings,
  searchSettings,
  updateSetting,
} from "@/features/settings/api/settingsApi";

export const settingKeys = {
  all: ["settings"] as const,
  get: (group: string, code: string) => ["settings", "get", group, code] as const,
  list: () => ["settings", "list"] as const,
  search: (body: SearchParamsModel<SearchSettingFilterModel> | null) => ["settings", "search", body] as const,
};

export function useCreateSetting(
  options?: Omit<UseMutationOptions<ResponseDto<GetSettingModel>, Error, CreateSettingModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSetting,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useUpdateSetting(
  options?: Omit<UseMutationOptions<ResponseDto<GetSettingModel>, Error, UpdateSettingModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSetting,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useDeleteSetting(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, { group: string; code: string }>, "mutationFn">,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ group, code }: { group: string; code: string }) => deleteSetting(group, code),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: settingKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useGetSetting(
  group: string,
  code: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetSettingModel>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: settingKeys.get(group, code),
    queryFn: () => getSetting(group, code),
    enabled: Boolean(group && code),
    ...options,
  });
}

export function useListSettings(
  options?: Omit<UseQueryOptions<ResponseDto<ListSettingModel[]>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: settingKeys.list(),
    queryFn: listSettings,
    ...options,
  });
}

export function useSearchSettings(
  searchParams: SearchParamsModel<SearchSettingFilterModel> | null,
  options?: Omit<UseQueryOptions<ResponseDto<QueryResultsModel<SearchSettingModel>>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: settingKeys.search(searchParams),
    queryFn: () => searchSettings(searchParams),
    enabled: Boolean(searchParams),
    ...options,
  });
}
