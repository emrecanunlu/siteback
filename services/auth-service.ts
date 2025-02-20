import httpClient from "~/lib/axios";
import type {
  LoginOTPRequest,
  LoginOTPResponse,
  LoginTokenResponse,
  LoginVerificationRequest,
} from "~/types/Auth";
import { ApiResult } from "~/types/Network";

export const loginOTP = async (data: LoginOTPRequest) => {
  const response = await httpClient.post<ApiResult<LoginOTPResponse>>(
    "/Auth/LoginOTP",
    data
  );
  return response.data;
};

export const loginVerification = async (data: LoginVerificationRequest) => {
  const response = await httpClient.post<ApiResult<LoginTokenResponse>>(
    "/Auth/LoginVerify",
    data
  );
  return response.data;
};
