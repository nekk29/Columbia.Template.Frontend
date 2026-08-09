import { environment } from "@/environments/environment";
import { createAxiosClient } from "@/core/api/apiClient";

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

const baseUrl = `${environment.backend.apiUrl}/application`;
const client = createAxiosClient(baseUrl);

export async function createApplication(body: CreateApplicationModel): Promise<ResponseDto<GetApplicationModel>> {
  const { data } = await client.post<ResponseDto<GetApplicationModel>>("", body);
  return data;
}

export async function updateApplication(body: UpdateApplicationModel): Promise<ResponseDto<GetApplicationModel>> {
  const { data } = await client.put<ResponseDto<GetApplicationModel>>("", body);
  return data;
}

export async function deleteApplication(id: string): Promise<ResponseBaseDto> {
  const { data } = await client.delete<ResponseBaseDto>(`/${id}`);
  return data;
}

export async function getApplication(id: string): Promise<ResponseDto<GetApplicationModel>> {
  const { data } = await client.get<ResponseDto<GetApplicationModel>>(`/${id}`);
  return data;
}

export async function listApplications(): Promise<ResponseDto<ListApplicationModel[]>> {
  const { data } = await client.get<ResponseDto<ListApplicationModel[]>>("/list");
  return data;
}

export async function searchApplications(body: SearchParamsModel<SearchApplicationFilterModel> | null): Promise<ResponseDto<QueryResultsModel<SearchApplicationModel>>> {
  const { data } = await client.post<ResponseDto<QueryResultsModel<SearchApplicationModel>>>("/search", body);
  return data;
}
