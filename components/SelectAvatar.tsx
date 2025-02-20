import { View, Image } from "react-native";
import { Button } from "./ui/button";
import { User } from "~/lib/icons/User";
import { Edit } from "~/lib/icons/Edit";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { useState } from "react";

type Props = {
  imageUri: string | null;
  onSelectImage: (image: ImagePicker.ImagePickerAsset) => void;
};

export const SelectAvatar = ({ imageUri, onSelectImage }: Props) => {
  const [image, setImage] = useState<string | null>(imageUri);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;

      setImage(fileUri);
      onSelectImage(result.assets[0]);
    }
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className="rounded-full w-20 h-20 border border-border relative"
      onPress={pickImage}
    >
      {image ? (
        <Image source={{ uri: image }} className="w-full h-full rounded-full" />
      ) : (
        <User className="text-primary" size={42} />
      )}
      <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-background rounded-full border border-border items-center justify-center">
        <Edit className="text-primary" size={14} />
      </View>
    </Button>
  );
};
