import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { FlatList, Pressable, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import VehicleCreateBottomSheet from "~/components/vehicle/VehicleCreateBottomSheet";
import { Icons } from "~/config/assets";
import { useGetVehicles } from "~/hooks/queries";

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

  const { data: result } = useGetVehicles();

  return (
    <View className="flex-1 bg-secondary/50">
      <Header />

      <View className="flex-1 justify-between">
        <FlatList
          data={result?.data ?? []}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="gap-y-3 px-4 py-6"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable>
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <View>
                    <CardTitle>{item.brand}</CardTitle>
                    <CardDescription>{item.model}</CardDescription>
                  </View>

                  <Image source={Icons.SedanCar} className="w-14 h-14" />
                </CardHeader>
              </Card>
            </Pressable>
          )}
        />

        <View className="px-4 pb-4">
          <Button onPress={() => bottomSheetRef.current?.present()}>
            <Text>Add Car</Text>
          </Button>
        </View>
      </View>

      <VehicleCreateBottomSheet ref={bottomSheetRef} />
    </View>
  );
}
