import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";

const Header = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View className="bg-background" style={{ paddingTop: top }}>
      <View className="flex-col gap-y-4 justify-between px-4 border-b border-border pb-2 shadow-md shadow-border pt-4">
        <Button variant="outline" size="icon" onPress={() => router.back()}>
          <ChevronLeft size={24} className="text-primary" />
        </Button>
        <Text className="text-3xl font-semibold">Your Cars</Text>
      </View>
    </View>
  );
};

export default function VehicleList() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-secondary/50">
      <Header />

      <View className="flex-1 p-4 justify-between">
        <View className="flex-1">
          <Text>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto
            ducimus nobis nihil molestias nemo amet rerum praesentium? Animi
            impedit enim obcaecati corporis adipisci laboriosam non dicta
            molestiae! Modi, fuga ut?
          </Text>
        </View>

        <View style={{ paddingBottom: bottom }}>
          <Button>
            <Text>Add Car</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
