import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { OtpInput } from "./OtpInput";
import { useAuth } from "~/providers/auth-providers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Lotties } from "~/config/assets";
import React from "react";
import { useVerifyEmailWithOtp } from "~/hooks/queries";

type MailVerifyBottomSheetProps = {
  onSuccess: () => void;
};

export const MailVerifyBottomSheet = forwardRef<
  BottomSheetModal,
  MailVerifyBottomSheetProps
>((props, ref) => {
  const { user, updateUser } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const { mutate: verifyEmailWithOtp } = useVerifyEmailWithOtp();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        enableTouchThrough={true}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const handleComplete = (otp: string) => {
    verifyEmailWithOtp(otp, {
      onSuccess: (response) => {
        if (response.data) {
          updateUser(response.data.tokenResponse, response.data.user);
          props.onSuccess();
        }
      },
    });
  };

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      enablePanDownToClose
      index={0}
      backdropComponent={renderBackdrop}
      keyboardBlurBehavior="restore"
    >
      <BottomSheetView style={{ paddingBottom: bottom }}>
        <View className="p-6">
          <View className="items-center justify-center">
            <LottieView
              source={Lotties.MailVerify}
              autoPlay
              loop
              style={{ width: 100, height: 100, marginBottom: 8 }}
            />
            <Text className="text-2xl font-semibold">Verify your email</Text>
            <Text className="text-muted-foreground text-base">
              We sent a verification code to your email address.
            </Text>
            <Text className="text-primary text-base font-medium mt-2">
              {user?.email}
            </Text>
          </View>

          <View className="mt-6">
            <OtpInput onComplete={handleComplete} autofocus isBottomSheet />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
