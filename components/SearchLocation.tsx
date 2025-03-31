import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Search } from "~/lib/icons/Search";
import { router } from "expo-router";
export default function SearchLocationBottomSheet() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="flex-1 items-center justify-start flex-row px-4 gap-x-3 h-12"
      onPress={() => router.push("/search-location")}
    >
      <Search className="text-muted-foreground" size={20} />
      <Text className="text-sm text-muted-foreground">Search Location</Text>
    </Button>
  );
}
