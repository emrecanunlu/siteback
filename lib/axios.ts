import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResult } from "~/types/Network";

const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL ?? "";

console.log(serverUrl);

const httpClient = axios.create({
  baseURL: serverUrl + "/api",
});

// Get more specific error message based on status code
const getErrorMessageByStatusCode = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return "Bad request. Please check your input.";
    case 401:
      return "Your session has expired. Please login again.";
    case 403:
      return "You don't have permission to access this resource.";
    case 404:
      return "The requested resource was not found.";
    case 408:
      return "Request timeout. Please try again.";
    case 409:
      return "Conflict with current state of the resource.";
    case 422:
      return "Validation error. Please check your input.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
      return "Server error. Please try again later.";
    case 502:
      return "Bad gateway. Please try again later.";
    case 503:
      return "Service unavailable. Please try again later.";
    case 504:
      return "Gateway timeout. Please try again later.";
    default:
      return statusCode >= 500
        ? "Server error. Please try again later."
        : "Request failed. Please try again.";
  }
};

httpClient.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResult>;
      const response = axiosError.response;
      const statusCode = response?.status ?? 500;

      // Session error
      if (statusCode === 401) {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
      }

      // Network errors
      if (axiosError.message && axiosError.message.includes("Network Error")) {
        throw new Error(
          `Network - Connection failed to ${serverUrl}. Please check your internet connection.`
        );
      }

      // SSL errors
      if (
        axiosError.message &&
        (axiosError.message.includes("SSL") ||
          axiosError.message.includes("certificate") ||
          axiosError.message.includes("CERT_"))
      ) {
        throw new Error(
          `SSL - Certificate error with ${serverUrl}. Please contact support.`
        );
      }

      // Timeout errors
      if (axiosError.code === "ECONNABORTED") {
        throw new Error(
          `Timeout - Request to ${serverUrl} took too long to complete.`
        );
      }

      // If API returns a message
      if (response?.data?.message) {
        throw new Error(`${statusCode} - ${response.data.message}`);
      }

      // If API doesn't return a message, use our custom error messages
      const specificErrorMessage = getErrorMessageByStatusCode(statusCode);
      throw new Error(`${statusCode} - ${specificErrorMessage}`);
    }

    // If not an Axios error
    throw new Error("500 - An unexpected error occurred. Please try again.");
  }
);

export default httpClient;
