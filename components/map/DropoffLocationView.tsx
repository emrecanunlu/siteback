import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  address: string | null;
  onConfirm: () => void;
};

export default function DropoffLocationView({ address, onConfirm }: Props) {
  return (
    <View>
      <Text className="text-xl font-bold mb-2.5">
        Where do you want to be dropped off ?
      </Text>
      <Input
        placeholder={address ?? "Enter your destination"}
        readOnly={true}
      />
      <Button className="w-full mt-6" onPress={onConfirm}>
        <Text>Confirm Dropoff</Text>
      </Button>
    </View>
  );
}
