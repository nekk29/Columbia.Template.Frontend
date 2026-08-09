import { environment } from "@/environments/environment";
import { createAxiosClient } from "@/core/api/apiClient";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";

import type { PermissionModel } from "@/features/permissions/models/permissionModel";
import type { RolePermissionModel } from "@/features/permissions/models/rolePermissionModel";

const baseUrl = `${environment.backend.apiUrl}/permission`;
const client = createAxiosClient(baseUrl);

export async function assignPermissions(roleId: string, actionIds: string[]): Promise<ResponseBaseDto> {
  const { data } = await client.post<ResponseBaseDto>(`/${roleId}/assign`, actionIds);
  return data;
}

export async function rolePermissions(roleId: string): Promise<ResponseDto<RolePermissionModel[]>> {
  const { data } = await client.get<ResponseDto<RolePermissionModel[]>>(`/${roleId}/role-permissions`);
  return data;
}

export async function userPermissions(applicationCode: string): Promise<ResponseDto<PermissionModel[]>> {
  const { data } = await client.get<ResponseDto<PermissionModel[]>>(`/${applicationCode}/user-permissions`);
  return data;
}
