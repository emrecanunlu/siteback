import { Icons } from "~/config/assets";
import { Currency } from "~/types/Enum";

export const currencies = [
  { name: "USD", symbol: "$", value: Currency.USD },
  { name: "EUR", symbol: "€", value: Currency.EUR },
  { name: "AED", symbol: "AED", value: Currency.AED },
  { name: "TRY", symbol: "₺", value: Currency.TRY },
];

export const vehicleTypes = [
  { name: "Sedan", icon: Icons.Vehicle.Sedan },
  { name: "SUV", icon: Icons.Vehicle.SUV },
  { name: "Hatchback", icon: Icons.Vehicle.Hatchback },
  { name: "Van", icon: Icons.Vehicle.Van },
  { name: "Cup", icon: Icons.Vehicle.Cup },
  { name: "Pickup", icon: Icons.Vehicle.Pickup },
];
