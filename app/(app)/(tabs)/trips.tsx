import { ActivityIndicator, FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useCallback, useState } from "react";
import { useGetTrips } from "~/hooks/queries";
import { currencies } from "~/utils/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const status = ["Pending", "Completed", "Cancelled"];

const Header = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View className="bg-background" style={{ paddingTop: top }}>
      <View className="flex-row items-end justify-between px-4 border-b border-border pb-2 shadow-md shadow-border pt-12">
        <Text className="text-3xl font-semibold">Your Trips</Text>
      </View>
    </View>
  );
};

export default function Trips() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const { data: result, isLoading } = useGetTrips(selectedIndex);

  const getCurrency = useCallback((type: number) => {
    return currencies.find((item) => item.value === type)?.symbol;
  }, []);

  return (
    <View className="flex-1 bg-secondary/50">
      <Header />

      <View className="px-4 flex-1">
        <View className="flex-row items-center justify-between gap-x-2 mt-6">
          {status.map((item, index) => (
            <View key={index} className="flex-1">
              <Button
                size="sm"
                variant={selectedIndex === index ? "default" : "outline"}
                className="w-full"
                onPress={() => setSelectedIndex(index)}
              >
                <Text>{item}</Text>
              </Button>
            </View>
          ))}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <FlatList
            data={result?.data ?? []}
            contentContainerClassName="gap-y-2 py-6"
            alwaysBounceVertical={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center">
                <Text className="text-muted-foreground font-medium text-lg">
                  No trips found
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Card>
                <CardHeader>
                  <CardDescription>Trip Details</CardDescription>
                </CardHeader>

                <CardContent>
                  <Text className="font-medium text-primary" numberOfLines={1}>
                    From, {item.pickupLocation}
                  </Text>
                  <Text
                    className="text-sm text-muted-foreground"
                    numberOfLines={1}
                  >
                    To, {item.dropoffLocation}
                  </Text>
                </CardContent>

                <CardFooter className="flex-row items-center justify-end gap-x-2">
                  <Text className="text-sm text-muted-foreground">
                    Total Amount:
                  </Text>

                  <Text className="font-medium text-primary">
                    {getCurrency(item.paymentType)}
                    {item.payment}
                  </Text>
                </CardFooter>
              </Card>
            )}
          />
        )}
      </View>
    </View>
  );
}
