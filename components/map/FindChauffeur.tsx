import { View, Image } from "react-native";
import { Text } from "../ui/text";
import { Loader } from "~/lib/icons/Loader";
import { Images } from "~/config/assets";
import { useColorScheme } from "~/lib/useColorScheme";

export default function FindChauffeur() {
  const { isDarkColorScheme } = useColorScheme();

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
