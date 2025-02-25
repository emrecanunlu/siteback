import axios from "~/lib/axios";
import { ApiResult } from "~/types/Network";
import { CreateTripDto, Trip } from "~/types/Trip";
import { NearestChauffeur } from "~/types/User";

export const getNearestChauffeur = async (lng: number, lat: number) => {
  const response = await axios.get<ApiResult<NearestChauffeur>>(
    `/Trip/NearestUser`,
    {
      params: {
        lng,
        lat,
      },
    }
  );
  return response.data;
};

export const createTrip = async (data: CreateTripDto) => {
  const response = await axios.post<ApiResult>(`/Trip/CreateTrip`, data);
  return response.data;
};

export const getTrips = async (status: number) => {
  const response = await axios.get<ApiResult<Trip[]>>(`/Trip/Trips`, {
    params: {
      TripStatus: status,
    },
  });
  return response.data;
};
