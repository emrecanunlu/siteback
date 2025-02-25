import { View } from "react-native";
import { NearestChauffeur } from "~/types/User";
import { Text } from "../ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type Props = {
  chauffeur: NearestChauffeur;
  onConfirm: () => void;
};

export default function ConfirmTripView({ chauffeur, onConfirm }: Props) {
  const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL ?? "";

  const getAvatarUri = (uri: string) => {
    const url = uri.includes("http") ? uri : `${serverUrl}/${uri}`;

    console.log(url);

    return url;
  };

  return (
    <View>
      <View className="flex-row items-center justify-center gap-x-3.5">
        <Avatar alt="Zach Nugent's Avatar" className="w-16 h-16">
          <AvatarImage
            source={{ uri: getAvatarUri(chauffeur.avatarUrl ?? "") }}
          />
          <AvatarFallback>
            <Text>
              {chauffeur.fullname.charAt(0)} {chauffeur.fullname.charAt(1)}
            </Text>
          </AvatarFallback>
        </Avatar>

        <View className="flex-1 gap-y-0.5">
          <Text className="text-xl font-bold">{chauffeur.fullname}</Text>
          <Text className="text-base text-primary/50">
            {chauffeur.mobilePhone}
          </Text>
        </View>
      </View>

      <Button variant="default" className="mt-8" onPress={onConfirm}>
        <Text>Confirm Trip</Text>
      </Button>
    </View>
  );
}
