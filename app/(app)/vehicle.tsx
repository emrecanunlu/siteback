import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import {
  FlatList,
  Pressable,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
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
import { ChevronLeft } from "~/lib/icons/ChevronLeft";

export default function Vehicle() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { data: result } = useGetVehicles();

  return (
    <FlatList
      data={result?.data ?? []}
      keyExtractor={(item) => item.id.toString()}
      contentContainerClassName="gap-y-3 flex-1 p-4"
      renderItem={({ item }) => (
        <TouchableOpacity
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
                <CardTitle className="text-xl">
                  {item.brand} - {item.model}
                </CardTitle>
                <CardDescription>{item.plateNumber}</CardDescription>
              </View>

              <Image source={Icons.SedanCar} className="w-14 h-14" />
            </CardHeader>
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}
