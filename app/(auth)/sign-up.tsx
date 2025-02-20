import { useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "~/lib/yup";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { useLoginVerification } from "~/hooks/queries";
import { useAuth } from "~/providers/auth-providers";

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
});

type FormData = yup.InferType<typeof schema>;

export default function SignUp() {
  const { phoneNumber, code } = useLocalSearchParams<{
    phoneNumber: string;
    code: string;
  }>();

  const { signIn } = useAuth();

  const lastNameRef = useRef<TextInput | null>(null);
  const emailRef = useRef<TextInput | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    shouldFocusError: false,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const mutation = useLoginVerification();

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        phone: phoneNumber,
        loginCode: parseInt(code),
        rememberMe: true,
      },
      {
        onError: (error) => {},
        onSuccess: (response) => {
          signIn(response.data!.accessToken, response.data!.refreshToken);
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 justify-between mt-4">
      <View className="px-6">
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={36} className="text-primary" />
        </Pressable>
      </View>

      <View className="flex-1 px-8 mt-12">
        <Text className="text-3xl font-semibold">Sign Up</Text>

        <View className="mt-12 flex-col gap-y-6">
          <View className="flex-row gap-x-6">
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <View className="flex-1">
                  <Input
                    placeholder="First Name"
                    className="bg-secondary native:h-14"
                    returnKeyType="next"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    ref={ref}
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                  />
                  {errors.firstName && (
                    <Text className="text-destructive text-sm mt-1">
                      {errors.firstName.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <View className="flex-1">
                  <Input
                    placeholder="Last Name"
                    className="bg-secondary native:h-14"
                    returnKeyType="next"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    ref={(r) => {
                      ref(r);
                      if (r) lastNameRef.current = r;
                    }}
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                  {errors.lastName && (
                    <Text className="text-destructive text-sm mt-1">
                      {errors.lastName.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <View>
                <Input
                  autoCapitalize="none"
                  placeholder="Email"
                  className="bg-secondary native:h-14"
                  returnKeyType="done"
                  keyboardType="email-address"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={(r) => {
                    ref(r);
                    if (r) emailRef.current = r;
                  }}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
                {errors.email && (
                  <Text className="text-destructive text-sm mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
      </View>

      <View className="py-4 px-8 border-t border-border shadow-md shadow-border">
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitted && !isValid}
        >
          <Text>Submit</Text>
        </Button>
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
