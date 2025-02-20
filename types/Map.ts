import { LatLng } from "react-native-maps";

export type SelectedLocation = {
  lat: number;
  long: number;
  address: string;
};

export type SelectedRegion = LatLng & { address: string };
