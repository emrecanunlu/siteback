export type CreateVehicleDto = {
  brand: string;
  model: string;
  plateNumber: string;
  isManual: boolean;
  hasInsurance: boolean;
};

export type Vehicle = {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  isManual: boolean;
  hasInsurance: boolean;
};
