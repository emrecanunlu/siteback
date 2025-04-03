import httpClient from "~/lib/axios";
import type {
  LoginOTPRequest,
  LoginOTPResponse,
  LoginTokenResponse,
  LoginVerificationRequest,
  OtpVerifyRequest,
  RefreshTokenRequest,
} from "~/types/Auth";
import { ApiResult } from "~/types/Network";
import { User } from "~/types/User";

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

export const refreshToken = async (data: RefreshTokenRequest) => {
  const response = await httpClient.post<
    ApiResult<{
      tokenResponse: LoginTokenResponse;
      user: User;
    }>
  >("/Auth/RefreshToken", data);
  return response.data;
};

export const otpVerify = async (data: OtpVerifyRequest) => {
  const response = await httpClient.post<ApiResult<LoginTokenResponse>>(
    "/Auth/OtpVerify",
    data
  );
  return response.data;
};
