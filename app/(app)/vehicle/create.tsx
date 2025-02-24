import { router } from "expo-router";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { StatusBar } from "expo-status-bar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import yup from "~/lib/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef } from "react";

type FormData = {
  brand: string;
  model: string;
  plateNumber: string;
  transmission: "automatic" | "manual";
  insurance: boolean;
};

const schema = yup.object({
  brand: yup.string().required(),
  model: yup.string().required(),
  plateNumber: yup.string().required(),
  transmission: yup.string().oneOf(["automatic", "manual"]).required(),
  insurance: yup.boolean().required(),
});

export default function VehicleCreate() {
  const { top, bottom } = useSafeAreaInsets();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      brand: "",
      model: "",
      plateNumber: "",
      transmission: "automatic",
      insurance: true,
    },
  });

  const onSubmit = handleSubmit((data) => {
    router.push({
      pathname: "/services/personal-chaffeur",
      params: {
        step: 3,
      },
    });
  });

  return (
    <KeyboardAvoidingView behavior={"height"} className="flex-1">
      <View className="flex-1 bg-primary" style={{ paddingTop: top }}>
        <View className="p-6 mb-6">
          <Button
            onPress={() => router.back()}
            className="rounded-full ml-auto w-12 h-12 bg-background"
            size="icon"
          >
            <ChevronLeft size={24} className="text-primary" />
          </Button>
        </View>

        <View className="flex-1 bg-background rounded-t-[60px]">
          <Text className="text-2xl font-semibold text-center py-8">
            Confirm Your Vehicle
          </Text>

          <View className="px-6 flex-1 justify-between">
            <ScrollView className="flex-1" bounces={false}>
              <View className="gap-y-6 pb-6">
                <Controller
                  control={control}
                  name="brand"
                  render={({ field }) => (
                    <View className="gap-y-1">
                      <Label className="ml-2">Car Brand</Label>
                      <Input
                        ref={(r) => {
                          if (r) {
                            inputRefs.current[0] = r;
                          }
                        }}
                        className="bg-none border-0 border-b border-b-border"
                        placeholder="Enter Car Brand"
                        value={field.value}
                        onChangeText={field.onChange}
                        returnKeyType="next"
                        onSubmitEditing={() => inputRefs.current[1]?.focus()}
                      />
                      {errors.brand && (
                        <Text className="text-destructive text-sm ml-2 mt-1">
                          {errors.brand.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="model"
                  render={({ field }) => (
                    <View className="gap-y-1">
                      <Label className="ml-2">Car Model</Label>
                      <Input
                        ref={(r) => {
                          if (r) {
                            inputRefs.current[1] = r;
                          }
                        }}
                        className="bg-none border-0 border-b border-b-border"
                        placeholder="Enter Car Model"
                        value={field.value}
                        onChangeText={field.onChange}
                        returnKeyType="next"
                        onSubmitEditing={() => inputRefs.current[2]?.focus()}
                      />
                      {errors.model && (
                        <Text className="text-destructive text-sm ml-2 mt-1">
                          {errors.model.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="plateNumber"
                  render={({ field }) => (
                    <View className="gap-y-1">
                      <Label className="ml-2">Plate Number</Label>
                      <Input
                        ref={(r) => {
                          if (r) {
                            inputRefs.current[2] = r;
                          }
                        }}
                        keyboardType="numbers-and-punctuation"
                        className="bg-none border-0 border-b border-b-border"
                        placeholder="Enter Plate Number"
                        value={field.value}
                        onChangeText={field.onChange}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          // Klavyeyi kapat
                          inputRefs.current[2]?.blur();
                        }}
                      />
                      {errors.plateNumber && (
                        <Text className="text-destructive text-sm ml-2 mt-1">
                          {errors.plateNumber.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="transmission"
                  render={({ field }) => (
                    <View className="gap-y-2">
                      <Label className="ml-2">Transmission Type</Label>
                      <View className="ml-2 flex-row items-center gap-x-2">
                        <Button
                          variant={
                            field.value === "automatic" ? "default" : "outline"
                          }
                          size="sm"
                          onPress={() => field.onChange("automatic")}
                        >
                          <Text>Automatic</Text>
                        </Button>
                        <Button
                          variant={
                            field.value === "manual" ? "default" : "outline"
                          }
                          size="sm"
                          onPress={() => field.onChange("manual")}
                        >
                          <Text>Manual</Text>
                        </Button>
                      </View>
                      {errors.transmission && (
                        <Text className="text-destructive text-sm ml-2 mt-1">
                          {errors.transmission.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="insurance"
                  render={({ field }) => (
                    <View className="gap-y-2">
                      <Label className="ml-2">
                        Do you have comprehensive insurance?
                      </Label>
                      <View className="ml-2 flex-row items-center gap-x-2">
                        <Button
                          variant={field.value ? "default" : "outline"}
                          size="sm"
                          onPress={() => field.onChange(true)}
                        >
                          <Text>Yes</Text>
                        </Button>
                        <Button
                          variant={!field.value ? "default" : "outline"}
                          size="sm"
                          onPress={() => field.onChange(false)}
                        >
                          <Text>No</Text>
                        </Button>
                      </View>
                      {errors.insurance && (
                        <Text className="text-destructive text-sm ml-2 mt-1">
                          {errors.insurance.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            </ScrollView>

            <View style={{ marginBottom: bottom }} className="pb-6">
              <Button
                variant="default"
                onPress={onSubmit}
                disabled={isSubmitted && !isValid}
              >
                <Text>Submit</Text>
              </Button>
            </View>
          </View>
        </View>
        <StatusBar style="light" />
      </View>
    </KeyboardAvoidingView>
  );
}
