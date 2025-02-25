import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL ?? "";

console.log(serverUrl);

const httpClient = axios.create({
  baseURL: serverUrl + "/api",
});

httpClient.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default httpClient;
