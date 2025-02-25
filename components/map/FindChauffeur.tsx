import { View, Image } from "react-native";
import { Text } from "../ui/text";
import { Loader } from "~/lib/icons/Loader";
import { Images } from "~/config/assets";
import { useColorScheme } from "~/lib/useColorScheme";
import { useGetNearestChauffeur } from "~/hooks/queries";
import { useEffect } from "react";
import { NearestChauffeur } from "~/types/User";
import { router } from "expo-router";

type Props = {
  lat: number;
  lng: number;
  onConfirm: (chauffeur: NearestChauffeur) => void;
};

export default function FindChauffeur({ lat, lng, onConfirm }: Props) {
  const { isDarkColorScheme } = useColorScheme();

  const { data: result, isLoading, error } = useGetNearestChauffeur(lat, lng);

  useEffect(() => {
    if (error || !result) return;

    setTimeout(() => {
      onConfirm(result.data!);
    }, 3000);
  }, [result, error]);

  return (
    <View className="flex-col items-center justify-center gap-y-6">
      <Image
        source={isDarkColorScheme ? Images.LogoLight : Images.LogoDark}
        className="w-32 h-8"
        resizeMode="contain"
      />
      <Text className="text-center text-lg font-medium">
        Finding chauffeur, please wait...
      </Text>
      <View className="flex-row items-center gap-x-4">
        <Loader
          className="animate-spin"
          size={32}
          color={isDarkColorScheme ? "white" : "black"}
        />
      </View>
    </View>
  );
}
