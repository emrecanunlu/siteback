import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import VehicleCreateBottomSheet from "~/components/vehicle/VehicleCreateBottomSheet";

const Header = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View className="bg-background" style={{ paddingTop: top }}>
      <View className="flex-row items-end justify-between px-4 border-b border-border pb-2 shadow-md shadow-border pt-12">
        <Text className="text-3xl font-semibold">Your Cars</Text>
      </View>
    </View>
  );
};

export default function Vehicle() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View className="flex-1 bg-secondary/50">
      <Header />

      <View className="flex-1 p-4 justify-between">
        <View className="flex-1">
          <Text>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto
            ducimus nobis nihil molestias nemo amet rerum praesentium? Animi
            impedit enim obcaecati corporis adipisci laboriosam non dicta
            molestiae! Modi, fuga ut?
          </Text>
        </View>

        <Button onPress={() => bottomSheetRef.current?.present()}>
          <Text>Add Car</Text>
        </Button>
      </View>

      <VehicleCreateBottomSheet ref={bottomSheetRef} />
    </View>
  );
}
