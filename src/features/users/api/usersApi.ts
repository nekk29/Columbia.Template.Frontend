import { environment } from "@/environments/environment";
import { createAxiosClient } from "@/core/api/apiClient";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { SearchParamsModel } from "@/models/base/query/SearchParamsModel";
import type { QueryResultsModel } from "@/models/base/query/QueryResultsModel";

import type { LoginModel } from "@/features/users/models/LoginModel";
import type { GetUserModel } from "@/features/users/models/GetUserModel";
import type { UserInfoModel } from "@/features/users/models/UserInfoModel";
import type { CreateUserModel } from "@/features/users/models/CreateUserModel";
import type { UpdateUserModel } from "@/features/users/models/UpdateUserModel";
import type { SearchUserModel } from "@/features/users/models/SearchUserModel";
import type { LoginResultModel } from "@/features/users/models/LoginResultModel";
import type { ResetPasswordModel } from "@/features/users/models/ResetPasswordModel";
import type { SearchUserFilterModel } from "@/features/users/models/SearchUserFilterModel";

const baseUrl = `${environment.backend.apiUrl}/user`;
const client = createAxiosClient(baseUrl);

export async function createUser(body: CreateUserModel): Promise<ResponseDto<GetUserModel>> {
  const { data } = await client.post<ResponseDto<GetUserModel>>("", body);
  return data;
}

export async function updateUser(body: UpdateUserModel): Promise<ResponseDto<GetUserModel>> {
  const { data } = await client.put<ResponseDto<GetUserModel>>("", body);
  return data;
}

export async function deleteUser(id: string): Promise<ResponseBaseDto> {
  const { data } = await client.delete<ResponseBaseDto>(`/${id}`);
  return data;
}

export async function getUser(id: string): Promise<ResponseDto<GetUserModel>> {
  const { data } = await client.get<ResponseDto<GetUserModel>>(`/${id}`);
  return data;
}

export async function searchUsers(body: SearchParamsModel<SearchUserFilterModel> | null): Promise<ResponseDto<QueryResultsModel<SearchUserModel>>> {
  const { data } = await client.post<ResponseDto<QueryResultsModel<SearchUserModel>>>("/search", body);
  return data;
}

export async function login(loginDto: LoginModel): Promise<ResponseDto<LoginResultModel>> {
  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-ApplicationCode': loginDto.applicationCode,
      'X-RememberMe': loginDto.rememberMe.toString(),
      'X-ReturnUrl': loginDto.returnUrl
    };

    const formData = new URLSearchParams();

    formData.append("grant_type", "password");
    formData.append("client_id", environment.security.clientId);
    formData.append("scope", environment.security.scope);
    formData.append("username", loginDto.userName);
    formData.append("password", loginDto.password);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await client.post<any>("/login", formData, {
      headers,
    });

    const response: ResponseDto<LoginResultModel> = {
      isValid: true,
      messages: [],
      data: data
    };

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const response: ResponseDto<LoginResultModel> = {
      isValid: false,
      messages: [],
      data: null
    };

    if (error?.response?.data?.error_description) {
      response.messages.push({
        key: "error",
        messageType: 3,
        messageTypeTitle: "Error",
        message: `${error?.response?.data?.error_description}`
      });
    } else {
      response.messages.push({
        key: "error",
        messageType: 3,
        messageTypeTitle: "Error",
        message: "An unexpected error occurred during login."
      });
    }
    return response as ResponseDto<LoginResultModel>;
  }
}

export async function userInfo(): Promise<UserInfoModel> {
  const { data } = await client.get<UserInfoModel>(`/info`);
  return data;
}

export async function forgotPassword(email: string): Promise<ResponseBaseDto> {
  const { data } = await client.get<ResponseBaseDto>(`/forgot-password/${email}`);
  return data;
}

export async function resetPassword(body: ResetPasswordModel): Promise<ResponseBaseDto> {
  const { data } = await client.post<ResponseBaseDto>("/reset-password", body);
  return data;
}
