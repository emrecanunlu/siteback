import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { Text } from "~/components/ui/text";
import MapView, {
  Marker,
  Polyline,
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
import FindChauffeur from "~/components/map/FindChauffeur";
import { NearestChauffeur } from "~/types/User";
import ConfirmTripView from "~/components/map/ConfirmTripView";
import { useCreateTrip } from "~/hooks/queries";
import { getDistance } from "geolib";
import SearchLocation from "~/components/SearchLocation";
import { Search } from "~/lib/icons/Search";

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
  const [chauffeur, setChauffeur] = useState<NearestChauffeur | null>(null);

  const { location } = useLocation();
  const { bottom, top } = useSafeAreaInsets();

  const mapViewRef = useRef<MapView>(null);

  const params = useLocalSearchParams<{
    vehicleId?: string;
    lng?: string;
    lat?: string;
  }>();
  const mutation = useCreateTrip();

  console.log("params", params);

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
      case 4:
        setChauffeur(null);
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

              /* setIsLoading(true); */
              setPickupLocation({
                latitude: region.latitude,
                longitude: region.longitude,
                address,
              });

              /* await delay(500); */
              setStep(2);
              /* setIsLoading(false); */
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

        return (
          <FindChauffeur
            onConfirm={(chauffeur) => {
              setChauffeur(chauffeur);
              setStep(4);
            }}
            lat={pickupLocation.longitude}
            lng={pickupLocation.latitude}
          />
        );
      case 4:
        if (!chauffeur) return null;

        return (
          <ConfirmTripView
            chauffeur={chauffeur}
            onConfirm={() => {
              if (!pickupLocation || !dropoffLocation) return;

              const distance =
                getDistance(pickupLocation, dropoffLocation) / 1000;
              const price = distance * 0.25;

              mutation.mutate(
                {
                  pickupLocation: pickupLocation.address,
                  dropoffLocation: dropoffLocation.address,
                  payment: price,
                  paymentType: selectedCurrency ?? Currency.USD,
                  pickupLng: pickupLocation.longitude,
                  pickupLat: pickupLocation.latitude,
                  description: "",
                },
                {
                  onSuccess: () => {
                    router.replace("/(app)/(tabs)/trips");
                  },
                }
              );
            }}
          />
        );
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

  useEffect(() => {
    if (step >= 2 && dropoffLocation && pickupLocation) {
      const coordinates: LatLng[] = [dropoffLocation, pickupLocation];

      setTimeout(() => {
        mapViewRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, bottom: 100, left: 100, right: 100 },
        });
      }, 1000);
    }
  }, [step, chauffeur, pickupLocation, dropoffLocation]);

  useEffect(() => {
    if (params.lat && params.lng) {
      zoomLocation({
        latitude: parseFloat(params.lat),
        longitude: parseFloat(params.lng),
      });
    }
  }, [params.lat, params.lng]);

  return (
    <View className="flex-1">
      <View
        className="absolute z-10 w-full px-6 flex-row items-center gap-x-4"
        style={{ marginTop: top }}
      >
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full shadow-md bg-background"
          onPress={handleBackPress}
        >
          <ChevronLeft className="text-primary" size={24} />
        </Button>

        {step < 2 && (
          <Button
            variant="outline"
            size="icon"
            className="flex-1 items-center justify-start flex-row px-4 gap-x-3 h-12"
            onPress={() => router.push("/search-location")}
          >
            <Search className="text-muted-foreground" size={20} />
            <Text className="text-sm text-muted-foreground">
              Search Location
            </Text>
          </Button>
        )}
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
              strokeWidth={3}
              origin={pickupLocation}
              destination={dropoffLocation}
              mode="DRIVING"
              optimizeWaypoints
            />
          )}
        </MapView>

        {step < 2 && (
          <Image
            source={Icons.Pin}
            className="w-16 h-16 -mt-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
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
      <AppLoader loading={mutation.isPending} />
    </View>
  );
}
