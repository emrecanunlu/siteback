import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, View } from "react-native";
import { OtpInput } from "~/components/OtpInput";
import { Text } from "~/components/ui/text";
import { useEffect, useState } from "react";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginVerification } from "~/hooks/queries";
import { useAuth } from "~/providers/auth-providers";
import AppLoader from "~/components/AppLoader";

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default function OtpVerification() {
  const [timeLeft, setTimeLeft] = useState(60);

  const { loading } = useAuth();
  const { phoneNumber, code, isRegistered } = useLocalSearchParams<{
    phoneNumber: string;
    code: string;
    isRegistered: string;
  }>();

  const { signIn } = useAuth();
  const mutation = useLoginVerification();

  const handleComplete = (otpCode: string) => {
    if (isRegistered === "false") {
      Alert.alert("Register Form", "Burası Daha Eklenmedi");
      return;
    }

    mutation.mutate(
      {
        phone: phoneNumber,
        loginCode: otpCode,
        rememberMe: true,
      },
      {
        onSuccess: (response) => {
          signIn(response.data!.accessToken, response.data!.refreshToken);
        },
      }
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 mt-4">
      <View className="px-6">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={36} className="text-primary" />
        </Pressable>
      </View>

      <View className="flex-1 mt-8 px-8">
        <Text className="text-2xl font-bold">Enter OTP</Text>

        <Text className="text-sm text-muted-foreground mt-6">
          We have sent you a verification code via SMS to
        </Text>

        <Text className="text-2xl font-bold mt-2">{phoneNumber}</Text>

        <View className="mt-8">
          <OtpInput onComplete={handleComplete} />
        </View>

        <Text className="text-muted-foreground font-medium text-sm mt-12">
          Resend in:{" "}
          <Text className="text-sm text-primary font-bold">
            {formatTime(timeLeft)}
          </Text>
        </Text>

        <StatusBar style="dark" />
      </View>

      <AppLoader loading={mutation.isPending || loading} />
    </SafeAreaView>
  );
}
