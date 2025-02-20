import { useMutation } from "@tanstack/react-query";
import { loginOTP, loginVerification } from "~/services/auth-service";
import { updateAvatar, updateUser } from "~/services/user-service";
import { LoginOTPRequest, LoginVerificationRequest } from "~/types/Auth";
import { UpdateUserDto } from "~/types/User";

export const useLoginOTP = () => {
  return useMutation({
    mutationKey: ["loginOTP"],
    mutationFn: (data: LoginOTPRequest) => loginOTP(data),
  });
};

export const useLoginVerification = () => {
  return useMutation({
    mutationKey: ["loginVerification"],
    mutationFn: (data: LoginVerificationRequest) => loginVerification(data),
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (data: UpdateUserDto) => updateUser(data),
  });
};

export const useUpdateAvatar = () => {
  return useMutation({
    mutationKey: ["updateAvatar"],
    mutationFn: (formData: FormData) => updateAvatar(formData),
  });
};
