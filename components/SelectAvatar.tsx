import { View, Image } from "react-native";
import { Button } from "./ui/button";
import { User } from "~/lib/icons/User";
import { Edit } from "~/lib/icons/Edit";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { useUpdateAvatar } from "~/hooks/queries";
import { useAuth } from "~/providers/auth-providers";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React from "react";
import AppLoader from "./AppLoader";

export const SelectAvatar = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>();

  const mutation = useUpdateAvatar();
  const { refreshToken, user } = useAuth();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];

    setSelectedImageUri(asset.uri);
    uploadAvatar(asset);
  };

  const uploadAvatar = (asset: ImagePicker.ImagePickerAsset) => {
    const type = asset.mimeType?.split("/").pop() ?? "jpg";
    const name = `${Date.now()}.${type}`;
    const uri = asset.uri;

    const formdata = new FormData();
    formdata.append("avatar", {
      name,
      type,
      uri,
    } as any);

    mutation.mutate(formdata, {
      onSuccess: () => {
        refreshToken();
      },
    });
  };

  const getUserAvatar = () => {
    if (selectedImageUri) {
      return selectedImageUri;
    }

    return `${process.env.EXPO_PUBLIC_SERVER_URL}/${user?.avatarUrl}`;
  };

  return (
    <React.Fragment>
      <Button
        variant="secondary"
        size="icon"
        className="rounded-full w-20 h-20 border border-border relative"
        onPress={pickImage}
      >
        <Avatar alt="Avatar" className="w-20 h-20">
          <AvatarImage source={{ uri: getUserAvatar() }} />
          <AvatarFallback>
            <User className="text-primary" size={38} />
          </AvatarFallback>
        </Avatar>
        <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-background rounded-full border border-border items-center justify-center">
          <Edit className="text-primary" size={14} />
        </View>
      </Button>

      <AppLoader loading={mutation.isPending} />
    </React.Fragment>
  );
};
