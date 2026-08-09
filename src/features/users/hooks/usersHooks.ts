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

import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunctionContext,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  searchUsers,
  login,
  userInfo,
  forgotPassword,
  resetPassword
} from "@/features/users/api/usersApi";

export const userKeys = {
  all: ["users"] as const,
  get: (id: string) => ["users", "get", id] as const,
  search: (body: SearchParamsModel<SearchUserFilterModel> | null) => ["users", "search", body] as const,
  info: () => ["users", "info"] as const,
};

export function useCreateUser(
  options?: Omit<UseMutationOptions<ResponseDto<GetUserModel>, Error, CreateUserModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetUserModel>, Error, CreateUserModel>({
    mutationFn: createUser,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useUpdateUser(
  options?: Omit<UseMutationOptions<ResponseDto<GetUserModel>, Error, UpdateUserModel>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<GetUserModel>, Error, UpdateUserModel>({
    mutationFn: updateUser,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useDeleteUser(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, string>, "mutationFn">,
) {
  const queryClient = useQueryClient();

  return useMutation<ResponseBaseDto, Error, string>({
    mutationFn: deleteUser,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(data, variables, () => { }, context as MutationFunctionContext);
    },
    ...options,
  });
}

export function useGetUser(
  id: string,
  options?: Omit<UseQueryOptions<ResponseDto<GetUserModel>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<GetUserModel>, Error>({
    queryKey: userKeys.get(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useSearchUsers(
  searchParams: SearchParamsModel<SearchUserFilterModel> | null,
  options?: Omit<UseQueryOptions<ResponseDto<QueryResultsModel<SearchUserModel>>, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<ResponseDto<QueryResultsModel<SearchUserModel>>, Error>({
    queryKey: userKeys.search(searchParams),
    queryFn: () => searchUsers(searchParams),
    enabled: Boolean(searchParams),
    ...options,
  });
}

export function useLogin(
  options?: Omit<UseMutationOptions<ResponseDto<LoginResultModel>, Error, LoginModel>, "mutationFn">,
) {
  return useMutation<ResponseDto<LoginResultModel>, Error, LoginModel>({
    mutationFn: login,
    ...options,
  });
}

export function useUserInfo(
  options?: Omit<UseQueryOptions<UserInfoModel, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<UserInfoModel, Error>({
    queryKey: userKeys.info(),
    queryFn: () => userInfo(),
    enabled: Boolean(true),
    ...options,
  });
}

export function useForgotPassword(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, string>, "mutationFn">,
) {
  return useMutation<ResponseBaseDto, Error, string>({
    mutationFn: forgotPassword,
    ...options,
  });
}

export function useResetPassword(
  options?: Omit<UseMutationOptions<ResponseBaseDto, Error, ResetPasswordModel>, "mutationFn">,
) {
  return useMutation<ResponseBaseDto, Error, ResetPasswordModel>({
    mutationFn: resetPassword,
    ...options,
  });
}
