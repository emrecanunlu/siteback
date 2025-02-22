import { View } from "react-native";
import { Text } from "../ui/text";
import { SelectedRegion } from "~/types/Map";
import { Currency } from "~/types/Enum";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useCallback, useRef } from "react";
import { currencies } from "~/utils/data";
import { Button } from "../ui/button";
import RouteConfirmBottomSheet from "./RouteConfirmBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
type Props = {
  pickupLocation: SelectedRegion;
  dropoffLocation: SelectedRegion;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  goBack: () => void;
};

export default function ConfirmPayPerMinuteView({
  pickupLocation,
  dropoffLocation,
  currency,
  onCurrencyChange,
  goBack,
}: Props) {
  const getCurrentCurrency = useCallback(() => {
    return currencies.find((c) => c.value === currency);
  }, [currency]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

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

      <View className="py-4">
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

      <View className="py-4 mb-4">
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

      <Button onPress={() => bottomSheetRef.current?.present()}>
        <Text>Book Now</Text>
      </Button>

      <RouteConfirmBottomSheet
        ref={bottomSheetRef}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        onEdit={() => goBack()}
      />
    </View>
  );
}
