export type LoginOTPRequest = {
  phone: string;
};

export type LoginOTPResponse = {
  isRegistered: boolean;
};

export type LoginVerificationRequest = {
  loginCode: string;
  email?: string;
  phone: string;
  firstname?: string;
  lastname?: string;
  rememberMe: boolean;
};

export type LoginTokenResponse = {
  accessToken: string;
  accessExpiration: string;
  refreshToken: string;
  refreshExpiration: string;
};

export type RefreshTokenRequest = Pick<
  LoginTokenResponse,
  "accessToken" | "refreshToken"
>;
export type OtpVerifyRequest = {
  phone: string;
  loginCode: string;
  rememberMe: boolean;
};
