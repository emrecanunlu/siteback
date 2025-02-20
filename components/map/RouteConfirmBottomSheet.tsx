import {
  useCallback,
  forwardRef,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Text } from "../ui/text";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { SelectedRegion } from "~/types/Map";
import { getDistance } from "geolib";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
type Props = {
  pickupLocation: SelectedRegion;
  dropoffLocation: SelectedRegion;
};

const RouteConfirmBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ pickupLocation, dropoffLocation }, ref) => {
    const { bottom } = useSafeAreaInsets();

    const mapViewRef = useRef<MapView>(null);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      []
    );

    const distance = useMemo(() => {
      return getDistance(pickupLocation, dropoffLocation) / 1000;
    }, [pickupLocation, dropoffLocation]);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ paddingBottom: bottom }}>
          <View className="p-6">
            <Text className="text-center font-bold text-2xl">
              Is your pickup location correct?
            </Text>

            <Text className="text-center font-medium mt-2 text-primary/50">
              Your current location seems {distance.toFixed(2)} km away from
              your chosen pickup location.
            </Text>

            <View className="h-64 mt-6 rounded-2xl overflow-hidden">
              <MapView
                ref={mapViewRef}
                style={{ flex: 1 }}
                scrollEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                zoomEnabled={false}
                provider={PROVIDER_GOOGLE}
              >
                <MapViewDirections
                  apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? ""}
                  origin={pickupLocation}
                  destination={dropoffLocation}
                  mode="DRIVING"
                  strokeWidth={2}
                  strokeColor="black"
                  optimizeWaypoints
                  onReady={(result) => {
                    mapViewRef.current?.fitToCoordinates(result.coordinates, {
                      animated: false,
                    });
                  }}
                />
              </MapView>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

RouteConfirmBottomSheet.displayName = "RouteConfirmBottomSheet";

export default RouteConfirmBottomSheet;
