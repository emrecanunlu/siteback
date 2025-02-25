export type Trip = {
  description: string;
  pickupLng: number;
  pickupLat: number;
  pickupLocation: string;
  dropoffLocation: string;
  payment: number;
  paymentType: number;
};

export type CreateTripDto = {
  description: string;
  pickupLng: number;
  pickupLat: number;
  pickupLocation: string;
  dropoffLocation: string;
  payment: number;
  paymentType: number;
};
