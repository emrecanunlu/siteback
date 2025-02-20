import { View } from "react-native";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  address: string | null;
  onConfirm: () => void;
};

export default function PickupLocationView({ address, onConfirm }: Props) {
  return (
    <View>
      <Text className="text-xl font-bold mb-2.5">Confirm Pickup Location</Text>
      <Input
        placeholder={address ?? "Enter your destination"}
        readOnly={true}
      />
      <Button className="w-full mt-6" onPress={onConfirm}>
        <Text>Confirm Pickup</Text>
      </Button>
    </View>
  );
}
