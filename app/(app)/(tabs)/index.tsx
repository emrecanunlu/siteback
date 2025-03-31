import { router } from "expo-router";
import { Image, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ServiceCard from "~/components/ServiceCard";
import { Button } from "~/components/ui/button";

import { Text } from "~/components/ui/text";
import { Icons, Images } from "~/config/assets";
import { User } from "~/lib/icons/User";
import { useColorScheme } from "~/lib/useColorScheme";
import { useAuth } from "~/providers/auth-providers";

export default function Home() {
  const { user } = useAuth();
  const { top } = useSafeAreaInsets();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex-1">
      <View
        className="bg-background flex-row items-center justify-between px-4 border-b border-border"
        style={{ paddingTop: top, height: 125 }}
      >
        <View className="flex-row items-center gap-x-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full w-12 h-12 border border-border"
            onPress={() => router.push("/profile")}
          >
            <User size={24} className="color-primary" />
          </Button>

          <Text className="text-lg font-medium">Hi, {user?.firstname}</Text>
        </View>
        <Image
          source={isDarkColorScheme ? Images.LogoLight : Images.LogoDark}
          className="w-32 aspect-auto"
          resizeMode="contain"
        />
      </View>

      <ScrollView className="flex-1 p-4 bg-secondary/50" bounces={false}>
        <ServiceCard
          title="Personal Chaffeur"
          description="Pay-Per-Minute | Hourly Booking"
          image={Icons.Chaffeur}
          onPress={() => router.push("/services/personal-chaffeur")}
        />
      </ScrollView>
    </View>
  );
}
