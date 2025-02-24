import { View, Image, Pressable, TouchableOpacity } from "react-native";
import { Text } from "../ui/text";
import { SelectedRegion } from "~/types/Map";
import { Currency } from "~/types/Enum";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useCallback, useRef, useState } from "react";
import { currencies } from "~/utils/data";
import { Button } from "../ui/button";
import RouteConfirmBottomSheet from "./RouteConfirmBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AppLoader from "../AppLoader";
import { router } from "expo-router";
import { Car } from "~/lib/icons/Car";
import { Icons } from "~/config/assets";
import { ChevronRight } from "~/lib/icons/ChevronRight";
type Props = {
  pickupLocation: SelectedRegion;
  dropoffLocation: SelectedRegion;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  goBack: () => void;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ConfirmPayPerMinuteView({
  pickupLocation,
  dropoffLocation,
  currency,
  onCurrencyChange,
  goBack,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const getCurrentCurrency = useCallback(() => {
    return currencies.find((c) => c.value === currency);
  }, [currency]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleBookNow = useCallback(async () => {
    setLoading(true);
    await delay(500);
    setLoading(false);
    bottomSheetRef.current?.present();
  }, []);

  return (
    <View>
      <Text className="text-xl font-bold mb-2.5">
        Confirm Pickup and Dropoff Locations
      </Text>

      <View className="bg-secondary -mx-6 px-6 py-4 flex-row items-center justify-between">
        <View>
          <Text className="font-semibold text-lg">Pay Per Minute</Text>
          <Text className="text-sm text-primary/50">
            Fare calcuted by minutes of your trip
          </Text>
        </View>

        <Text className="font-bold text-lg">
          21 - 27 {getCurrentCurrency()?.symbol}
        </Text>
      </View>

      <View className="mt-2">
        <Text className="font-semibold text-lg mb-2">Currency Types</Text>
        <ToggleGroup
          value={getCurrentCurrency()?.name ?? ""}
          onValueChange={(value) => {
            const currency = currencies.find((c) => c.name === value);
            if (currency) {
              onCurrencyChange(currency.value);
            }
          }}
          type="single"
        >
          {currencies.map((c) => (
            <ToggleGroupItem
              className="flex-1"
              variant="outline"
              key={c.value}
              value={c.name}
            >
              <Text>{c.name}</Text>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </View>

      <View className="mb-2 mt-4">
        <Text className="font-semibold text-lg mb-2">Selected Vehicle</Text>
        <TouchableOpacity
          className="flex-row items-center justify-between pr-4 pl-2"
          onPress={() => router.push("/vehicle/list")}
        >
          <View className="flex-row items-center gap-x-4">
            <Image source={Icons.SedanCar} className="w-12 h-12 rounded-lg" />

            <View className="flex-1">
              <Text className="font-medium">Choose Car</Text>
              {/* <Text className="text-sm font-medium text-primary/50">
                35 PIR 61
              </Text> */}
            </View>
          </View>
          <ChevronRight size={18} className="text-primary" />
        </TouchableOpacity>
      </View>

      <View className="py-4 mb-4 px-2">
        <View className="flex-row items-center gap-x-3">
          <View className="w-4 h-4 rounded-full border-2 border-primary"></View>
          <Text className="flex-1" numberOfLines={1}>
            {pickupLocation.address}
          </Text>
        </View>

        <View className="h-6 w-0.5 bg-primary ml-1.5 my-1" />

        <View className="flex-row items-center gap-x-3">
          <View className="w-4 h-4 rounded-full bg-primary"></View>
          <Text className="flex-1" numberOfLines={1}>
            {dropoffLocation.address}
          </Text>
        </View>
      </View>

      <Button onPress={handleBookNow}>
        <Text>Book Now</Text>
      </Button>

      <RouteConfirmBottomSheet
        ref={bottomSheetRef}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        onEdit={goBack}
        onContinue={() => {
          bottomSheetRef.current?.dismiss();

          router.push("/vehicle");
        }}
      />

      <AppLoader loading={loading} />
    </View>
  );
}
