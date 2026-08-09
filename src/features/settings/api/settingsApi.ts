import { environment } from "@/environments/environment";
import { createAxiosClient } from "@/core/api/apiClient";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { SearchParamsModel } from "@/models/base/query/SearchParamsModel";
import type { QueryResultsModel } from "@/models/base/query/QueryResultsModel";
import type { CreateSettingModel } from "@/features/settings/models/CreateSettingModel";
import type { GetSettingModel } from "@/features/settings/models/GetSettingModel";
import type { ListSettingModel } from "@/features/settings/models/ListSettingModel";
import type { SearchSettingFilterModel } from "@/features/settings/models/SearchSettingFilterModel";
import type { SearchSettingModel } from "@/features/settings/models/SearchSettingModel";
import type { UpdateSettingModel } from "@/features/settings/models/UpdateSettingModel";

const client = createAxiosClient(`${environment.backend.apiUrl}/setting`);

export async function createSetting(body: CreateSettingModel): Promise<ResponseDto<GetSettingModel>> {
  const { data } = await client.post<ResponseDto<GetSettingModel>>("", body);
  return data;
}

export async function updateSetting(body: UpdateSettingModel): Promise<ResponseDto<GetSettingModel>> {
  const { data } = await client.put<ResponseDto<GetSettingModel>>("", body);
  return data;
}

export async function deleteSetting(group: string, code: string): Promise<ResponseBaseDto> {
  const { data } = await client.delete<ResponseBaseDto>(`/${encodeURIComponent(group)}/${encodeURIComponent(code)}`);
  return data;
}

export async function getSetting(group: string, code: string): Promise<ResponseDto<GetSettingModel>> {
  const { data } = await client.get<ResponseDto<GetSettingModel>>(`/${encodeURIComponent(group)}/${encodeURIComponent(code)}`);
  return data;
}

export async function listSettings(): Promise<ResponseDto<ListSettingModel[]>> {
  const { data } = await client.get<ResponseDto<ListSettingModel[]>>("/list");
  return data;
}

export async function searchSettings(body: SearchParamsModel<SearchSettingFilterModel> | null): Promise<ResponseDto<QueryResultsModel<SearchSettingModel>>> {
  const { data } = await client.post<ResponseDto<QueryResultsModel<SearchSettingModel>>>("/search", body);
  return data;
}