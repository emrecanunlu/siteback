import { Text } from "~/components/ui/text";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Alert, FlatList, SafeAreaView, TextInput } from "react-native";
import { Button } from "~/components/ui/button";
import { MapPin } from "~/lib/icons/MapPin";
import { useKeyboard } from "~/lib/keyboard";
import { SearchBarCommands } from "react-native-screens";

type Props = {
  currentLocation: string;
};

export default function SearchLocation() {
  const [locationList, setLocationList] = useState<any[]>([]);
  const [debounceSearch, setDebounceSearch] = useDebounceValue("", 500);

  const router = useRouter();
  const inputRef = useRef<SearchBarCommands>(null);

  const getLocationBySearch = async (search: string) => {
    const uri = new URL(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json"
    );
    uri.searchParams.set("input", search);
    uri.searchParams.set("key", process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

    const response = await fetch(uri.toString());
    const data = await response.json();

    setLocationList(data.predictions);
  };

  const getLngLngByAddress = async (address: string) => {
    inputRef.current?.cancelSearch();

    const uri = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    uri.searchParams.set("address", address);
    uri.searchParams.set("key", process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "");

    const response = await fetch(uri.toString());
    const data = await response.json();

    if (data?.status === "OK") {
      const lng = data.results[0].geometry.location.lng;
      const lat = data.results[0].geometry.location.lat;

      router.back();
      router.setParams({
        lng,
        lat,
      });
    } else {
      Alert.alert("Error", data?.error_message || "Failed to get location");
    }
  };

  useEffect(() => {
    if (debounceSearch.length > 2) {
      getLocationBySearch(debounceSearch);
    } else {
      setLocationList([]);
    }
  }, [debounceSearch]);

  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          title: "Locations",
          headerLargeTitle: true,
          headerSearchBarOptions: {
            placeholder: "Search Location",
            ref: inputRef,
            autoFocus: true,
            autoCapitalize: "none",
            onChangeText: (event) => setDebounceSearch(event.nativeEvent.text),
            onCancelButtonPress: () => {
              setLocationList([]);
            },
          },
        }}
      />

      <SafeAreaView className="flex-1">
        <FlatList
          keyExtractor={(item) => item.place_id}
          bounces={false}
          data={locationList}
          contentContainerStyle={{ flex: 1 }}
          renderItem={({ item }) => (
            <Button
              variant="ghost"
              className="flex-row items-center justify-start gap-x-2"
              onPress={() => getLngLngByAddress(item.description)}
            >
              <MapPin className="text-muted-foreground" size={18} />
              <Text className="text-foreground/75 flex-1" numberOfLines={1}>
                {item.description}
              </Text>
            </Button>
          )}
        />
      </SafeAreaView>
    </React.Fragment>
  );
}
