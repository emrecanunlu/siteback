import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import { FlatList, Pressable, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import VehicleCreateBottomSheet from "~/components/vehicle/VehicleCreateBottomSheet";
import { Icons } from "~/config/assets";
import { useGetVehicles } from "~/hooks/queries";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";

const Header = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View className="bg-background" style={{ paddingTop: top }}>
      <View className="flex-col items-start justify-between px-4 border-b border-border pb-2 shadow-md shadow-border pt-8 gap-y-4">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft className="text-primary" size={24} />
        </Pressable>
        <Text className="text-3xl font-semibold">Your Cars</Text>
      </View>
    </View>
  );
};

export default function Vehicle() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { bottom } = useSafeAreaInsets();
  const { data: result } = useGetVehicles();

  return (
    <View className="flex-1 bg-secondary/50" style={{ paddingBottom: bottom }}>
      <Header />

      <View className="flex-1 p-4 justify-between">
        <FlatList
          data={result?.data ?? []}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="gap-y-3"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.back();
                router.setParams({
                  vehicleId: item.id,
                });
              }}
            >
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

        <Button
          onPress={() => bottomSheetRef.current?.present()}
          className="mt-3"
        >
          <Text>Add Car</Text>
        </Button>
      </View>

      <VehicleCreateBottomSheet ref={bottomSheetRef} />
    </View>
  );
}
