import { useMutation, useQuery } from "@tanstack/react-query";
import { loginOTP, loginVerification } from "~/services/auth-service";
import { updateAvatar, updateUser } from "~/services/user-service";
import { createVehicle, getVehicles } from "~/services/vehicle-service";
import { LoginOTPRequest, LoginVerificationRequest } from "~/types/Auth";
import { UpdateUserDto } from "~/types/User";
import { CreateVehicleDto } from "~/types/Vehicle";

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

export const useCreateVehicle = () => {
  return useMutation({
    mutationKey: ["createVehicle"],
    mutationFn: (data: CreateVehicleDto) => createVehicle(data),
  });
};

export const useGetVehicles = () => {
  return useQuery({
    queryKey: ["getVehicles"],
    queryFn: () => getVehicles(),
  });
};
