import { Icons } from "~/config/assets";
import { View } from "react-native";
import { Button } from "../ui/button";

export default function ToggleVehicleType() {
  const vehicles = [
    {
      name: "Sedan",
      icon: Icons.Vehicle.Sedan,
    },
    {
      name: "SUV",
      icon: Icons.Vehicle.SUV,
    },
    {
      name: "Hatchback",
      icon: Icons.Vehicle.Hatchback,
    },
    {
      name: "Van",
      icon: Icons.Vehicle.Van,
    },
    {
      name: "Cup",
      icon: Icons.Vehicle.Cup,
    },
    {
      name: "Pickup",
      icon: Icons.Vehicle.Pickup,
    },
  ];

  return (
    <View className="flex-row gap-x-2">
      {vehicles.map((vehicle) => (
        <Button key={vehicle.name}>{vehicle.name}</Button>
      ))}
    </View>
  );
}
