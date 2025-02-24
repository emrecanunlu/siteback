import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
  LatLng,
} from "react-native-maps";
import { StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Icons } from "~/config/assets";
import { Image } from "react-native";
import { useLocation } from "~/hooks/useLocation";
import PickupLocationView from "~/components/map/PickupLocationView";
import DropoffLocationView from "~/components/map/DropoffLocationView";
import ConfirmPayPerMinuteView from "~/components/map/ConfirmPayPerMinuteView";
import MapViewDirections from "react-native-maps-directions";
import AppLoader from "~/components/AppLoader";
import { SelectedRegion } from "~/types/Map";
import { Currency } from "~/types/Enum";
import { Text } from "~/components/ui/text";
import { Vehicle } from "~/types/Vehicle";
import FindChauffeur from "~/components/map/FindChauffeur";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PersonalChaffeur() {
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    Currency.USD
  );
  const [pickupLocation, setPickupLocation] = useState<SelectedRegion | null>(
    null
  );
  const [dropoffLocation, setDropoffLocation] = useState<SelectedRegion | null>(
    null
  );
  const [step, setStep] = useState<number>(0);
  const [region, setRegion] = useState<Region | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { location } = useLocation();
  const { bottom, top } = useSafeAreaInsets();

  const mapViewRef = useRef<MapView>(null);

  const params = useLocalSearchParams<{ vehicleId?: string }>();

  const getCurrentLocationAddress = async (region: Region) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
    );

    if (response.status === 200 && response.ok) {
      const data = await response.json();
      setAddress(data.results[0].formatted_address);
    }
  };

  const handleRegionChange = (region: Region) => {
    if (step >= 2) return;

    setRegion(region);
    getCurrentLocationAddress(region);
  };

  const handleBackPress = () => {
    switch (step) {
      case 0:
        router.back();
        break;
      case 1:
        if (!dropoffLocation) return;

        setStep(0);
        zoomLocation({
          latitude: dropoffLocation.latitude,
          longitude: dropoffLocation.longitude,
        });
        break;
      case 2:
        if (!pickupLocation) return;

        setStep(1);
        zoomLocation({
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
        });
        break;
      case 3:
        setStep(2);
        break;
      default:
        break;
    }
  };
  const renderBottomView = () => {
    switch (step) {
      case 0:
        return (
          <DropoffLocationView
            address={address}
            onConfirm={() => {
              if (!region || !address || !location) return;

              setStep(1);
              setDropoffLocation({
                latitude: region.latitude,
                longitude: region.longitude,
                address: address,
              });
              zoomLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }}
          />
        );
      case 1:
        return (
          <PickupLocationView
            address={address}
            onConfirm={async () => {
              if (!region || !address) return;

              setIsLoading(true);
              setPickupLocation({
                latitude: region.latitude,
                longitude: region.longitude,
                address,
              });

              // Kısa bir loading göster
              await delay(500);
              setStep(2);
              setIsLoading(false);
            }}
          />
        );
      case 2:
        if (!pickupLocation || !dropoffLocation) return null;

        return (
          <ConfirmPayPerMinuteView
            onContinue={() => {
              setStep(3);
            }}
            vehicleId={vehicleId}
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            currency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            goBack={() => {
              zoomLocation({
                latitude: dropoffLocation.latitude,
                longitude: dropoffLocation.longitude,
              });
              setStep(0);
            }}
          />
        );
      case 3:
        if (!pickupLocation || !dropoffLocation) return null;

        return <FindChauffeur />;
    }
  };

  const zoomLocation = ({ latitude, longitude }: LatLng) => {
    mapViewRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  useEffect(() => {
    if (!location) return;

    zoomLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }, [location]);

  useEffect(() => {
    if (params.vehicleId) {
      setVehicleId(parseInt(params.vehicleId));
    }
  }, [params.vehicleId]);

  return (
    <View className="flex-1">
      <View className="absolute z-10 w-full px-6" style={{ marginTop: top }}>
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full shadow-md bg-background"
          onPress={handleBackPress}
        >
          <ChevronLeft className="text-primary" size={24} />
        </Button>
      </View>

      <View className="flex-1 relative">
        <MapView
          ref={mapViewRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton
          onRegionChangeComplete={handleRegionChange}
          mapPadding={{
            top: 0,
            bottom: 50,
            left: 0,
            right: 0,
          }}
        >
          {step >= 2 && pickupLocation && (
            <Marker
              coordinate={pickupLocation}
              title="Pickup Location"
              description={pickupLocation.address}
            />
          )}

          {step >= 2 && dropoffLocation && (
            <Marker
              coordinate={dropoffLocation}
              title="Dropoff Location"
              description={dropoffLocation.address}
            />
          )}

          {pickupLocation && dropoffLocation && step >= 2 && (
            <MapViewDirections
              key={step}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? ""}
              origin={pickupLocation}
              destination={dropoffLocation}
              strokeWidth={3}
              mode="DRIVING"
              optimizeWaypoints
              onReady={(result) => {
                mapViewRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
                });
              }}
            />
          )}
        </MapView>

        {step < 2 && (
          <Image
            source={Icons.Pin}
            className="w-16 h-16 -mt-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            resizeMode="contain"
          />
        )}
      </View>

      <View
        className="border border-border rounded-t-3xl bg-background"
        style={{
          paddingBottom: bottom,
          marginTop: -50,
        }}
      >
        <View className="p-6">{renderBottomView()}</View>
      </View>
      <AppLoader loading={isLoading} />
    </View>
  );
}
