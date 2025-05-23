import {
  View,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Images } from "~/config/assets";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import countries from "~/assets/countries.json";
import { Input } from "~/components/ui/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { router } from "expo-router";
import { useLoginOTP } from "~/hooks/queries";
import AppLoader from "~/components/AppLoader";

export default function Welcome() {
  const [search, setSearch] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("TR");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { bottom } = useSafeAreaInsets();

  const mutation = useLoginOTP();

  const getSelectedCountry = useCallback(() => {
    const country = countries.find((c) => c.code === selectedCountry);
    return country;
  }, [selectedCountry]);

  const handleSelectCountry = useCallback((code: string) => {
    setSelectedCountry(code);
    setIsOpen(false);
  }, []);

  const handleSubmit = async () => {
    if (phoneNumber.length === 0) return;

    mutation.mutate(
      { phone: getSelectedCountry()?.dial_code + phoneNumber },
      {
        onSuccess: (response) => {
          router.push({
            pathname: "/otp-verification",
            params: {
              phoneNumber: getSelectedCountry()?.dial_code + phoneNumber,
              isRegistered: response.data?.isRegistered?.toString() || "false",
            },
          });
        },
      }
    );
  };

  const filteredCountries = useMemo(() => {
    return search.length > 0
      ? countries.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase())
        )
      : countries;
  }, [search]);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  return (
    <View className="flex-1">
      <View className="absolute inset-0">
        <Image
          source={Images.WelcomeBackground}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
          resizeMethod="resize"
        />

        <LinearGradient
          colors={[
            "transparent",
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.9)",
            "black",
          ]}
          style={styles.background}
          locations={[0, 0.1, 0.6, 1]}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={{ zIndex: 1 }}
      >
        <View
          className="flex-1 justify-end px-4"
          style={{ paddingBottom: bottom }}
        >
          <Image
            source={Images.LogoLight}
            className="w-36 h-8 mb-6"
            resizeMode="contain"
          />

          <View className="space-y-2 mb-4">
            <Text className="text-white/60 text-sm font-medium px-1">
              Phone Number
            </Text>
            <View className="flex-row items-center gap-x-3">
              <TouchableOpacity
                className="h-14 px-4 rounded-2xl bg-white/10 backdrop-blur-md flex-row items-center"
                onPress={() => setIsOpen(!isOpen)}
              >
                <Text className="text-2xl">{getSelectedCountry()?.flag}</Text>
                <Text className="text-white text-base font-medium ml-2">
                  {getSelectedCountry()?.dial_code}
                </Text>
                <ChevronDown
                  size={16}
                  color="white"
                  className="ml-2 opacity-60"
                />
              </TouchableOpacity>
              <View className="flex-1 h-14 rounded-2xl bg-white/10 backdrop-blur-md px-4 justify-center">
                <Input
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-white/40 font-medium h-full text-lg -mt-0.5"
                  placeholder={isOpen ? "Search" : "(555) 555 55 55"}
                  keyboardType={isOpen ? "default" : "phone-pad"}
                  returnKeyType="done"
                  value={isOpen ? search : phoneNumber}
                  onChangeText={isOpen ? setSearch : setPhoneNumber}
                  onEndEditing={handleSubmit}
                />
              </View>
            </View>
          </View>

          {isOpen && (
            <FlatList
              data={filteredCountries}
              className="max-h-64 bg-white/10 backdrop-blur-md rounded-2xl mb-4"
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="h-14 px-4 flex-row items-center"
                  onPress={() => handleSelectCountry(item.code)}
                >
                  <View className="flex-row items-center gap-x-2 flex-1">
                    <Text className="text-white font-medium ml-2 text-2xl">
                      {item.flag}
                    </Text>
                    <Text className="text-white text-base font-medium ml-2">
                      {item.name}
                    </Text>
                  </View>

                  <Text className="text-base ml-2 text-zinc-400 font-semibold">
                    {item.dial_code}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.code}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-white/10" />
              )}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      <AppLoader loading={mutation.isPending} />

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
});
