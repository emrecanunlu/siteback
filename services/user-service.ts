import axios from "~/lib/axios";
import { LoginTokenResponse } from "~/types/Auth";
import { ApiResult } from "~/types/Network";
import type { UpdateUserDto, User } from "~/types/User";

export const getUser = async () => {
  const response = await axios.get<ApiResult<User>>("/User/Me");
  return response.data;
};

export const updateUser = async (data: UpdateUserDto) => {
  const response = await axios.post<
    ApiResult<{ tokenResponse: LoginTokenResponse }>
  >("/User/Update", data);
  return response.data;
};

export const updateAvatar = async (formData: FormData) => {
  const response = await axios.post<
    ApiResult<{ tokenResponse: LoginTokenResponse }>
  >("/User/UpdateAvatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
