import httpClient from "~/lib/axios";
import { ApiResult } from "~/types/Network";
import { CreateVehicleDto, Vehicle } from "~/types/Vehicle";

export const createVehicle = async (data: CreateVehicleDto) => {
  const response = await httpClient.post<ApiResult>("/Car/Create", data);
  return response.data;
};

export const getVehicles = async () => {
  const response = await httpClient.get<ApiResult<Vehicle[]>>("/Car/List");
  return response.data;
};
