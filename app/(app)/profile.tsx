import {
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gender } from "~/types/Enum";
import { SelectAvatar } from "~/components/SelectAvatar";
import { useAuth } from "~/providers/auth-providers";
import { useUpdateUser, useVerifyEmail } from "~/hooks/queries";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { MailVerifyBottomSheet } from "~/components/MailVerifyBottomSheet";
import yup from "~/lib/yup";

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  dateOfBirth: yup.date().optional(),
  gender: yup
    .mixed<Gender>()
    .oneOf(Object.values(Gender) as Gender[])
    .required(),
});

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { signOut } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const { mutate: updateUserMutation, isPending: isUpdatingUser } =
    useUpdateUser();
  const { mutate: verifyEmail, isPending: isVerifyingEmail } = useVerifyEmail();

  const inputRefs = useRef<TextInput[]>([]);
  const mailVerifyBottomSheetRef = useRef<BottomSheetModal>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    shouldFocusError: false,
    resolver: yupResolver(schema),
    defaultValues: {
      email: user?.email,
      firstName: user?.firstname,
      lastName: user?.lastname,
      gender: Gender.Male,
    },
  });

  const onSubmit = handleSubmit((values) => {
    updateUserMutation(
      {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        gender: values.gender,
      },
      {
        onSuccess: (response) => {
          updateUser(response.data!.tokenResponse, response.data!.user);
        },
      }
    );
  });

  const handleVerifyEmail = () => {
    mailVerifyBottomSheetRef.current?.present();
  };

  return (
    <KeyboardAvoidingView behavior={"height"} className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="py-6 px-4 gap-y-8 flex-1">
          <SelectAvatar />

          <Controller
            control={control}
            name="firstName"
            render={({ field: { onBlur, onChange, value, ref } }) => (
              <View>
                <Text className="text-sm text-muted-foreground font-medium ml-2">
                  First Name
                </Text>
                <Input
                  className="border-0 border-b border-border"
                  placeholder="First Name"
                  returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={() => {
                    inputRefs.current[1].focus();
                  }}
                  ref={(r) => {
                    ref(r);
                    if (r) {
                      inputRefs.current.push(r);
                    }
                  }}
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
            render={({ field: { onBlur, onChange, value } }) => (
              <View>
                <Text className="text-sm text-muted-foreground font-medium ml-2">
                  Last Name
                </Text>
                <Input
                  className="border-0 border-b border-border"
                  placeholder="Last Name"
                  returnKeyType="next"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={() => {
                    inputRefs.current[2].focus();
                  }}
                  ref={(r) => {
                    if (r) {
                      inputRefs.current.push(r);
                    }
                  }}
                />
                {errors.lastName && (
                  <Text className="text-destructive text-sm mt-1">
                    {errors.lastName.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onBlur, onChange, value, ref } }) => (
              <View>
                <Text className="text-sm text-muted-foreground font-medium ml-2">
                  Email
                </Text>
                <View className="relative">
                  <Input
                    className="border-0 border-b border-border"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Email"
                    returnKeyType="done"
                    ref={(r) => {
                      ref(r);
                      if (r) {
                        inputRefs.current.push(r);
                      }
                    }}
                  />

                  {!user?.isMailVerified && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0"
                      onPress={handleVerifyEmail}
                    >
                      <Text>Verify</Text>
                    </Button>
                  )}
                </View>
                {errors.email && (
                  <Text className="text-destructive text-sm mt-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text className="text-sm text-muted-foreground font-medium ml-2">
                  Gender
                </Text>
                <View className="flex-row gap-x-2 mt-3 ml-2">
                  <Button
                    variant={value === Gender.Male ? "default" : "outline"}
                    size="sm"
                    onPress={() => onChange(Gender.Male)}
                  >
                    <Text>Male</Text>
                  </Button>
                  <Button
                    variant={value === Gender.Female ? "default" : "outline"}
                    size="sm"
                    onPress={() => onChange(Gender.Female)}
                  >
                    <Text>Female</Text>
                  </Button>
                </View>

                {errors.gender && (
                  <Text className="text-destructive text-sm mt-2 ml-1">
                    {errors.gender.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onPress={() => signOut()}
          >
            <Text>Logout</Text>
          </Button>
        </View>
      </ScrollView>

      <View
        className="p-4 border-t border-border shadow-md shadow-border"
        style={{ marginBottom: bottom }}
      >
        <Button onPress={onSubmit} disabled={isUpdatingUser}>
          <Text>Save</Text>
        </Button>
      </View>

      <MailVerifyBottomSheet ref={mailVerifyBottomSheetRef} />
    </KeyboardAvoidingView>
  );
}
