import {
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text } from "../ui/text";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/button";
import { BottomSheetInput } from "../ui/bottomsheet-input";
import { Controller, useForm } from "react-hook-form";
import yup from "~/lib/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateVehicle } from "~/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import { vehicleTypes } from "~/utils/data";
import { cn } from "~/lib/utils";

type Props = {};

type FormData = {
  brand: string;
  model: string;
  plateNumber: string;
  transmissionType: "automatic" | "manual";
  comprehensiveInsurance: boolean;
  iconName: string;
};

const schema = yup.object({
  brand: yup.string().required(),
  model: yup.string().required(),
  plateNumber: yup.string().required(),
  transmissionType: yup.string().oneOf(["automatic", "manual"]).required(),
  comprehensiveInsurance: yup.boolean().required(),
  iconName: yup.string().required(),
});

const VehicleCreateBottomSheet = forwardRef<BottomSheetModal, Props>(
  (props, ref) => {
    const queryClient = useQueryClient();
    const mutation = useCreateVehicle();
    const bottomSheetRef = ref as React.MutableRefObject<BottomSheetModal>;

    const {
      control,
      handleSubmit: onSubmit,
      formState: { isValid, isSubmitted },
      reset,
    } = useForm<FormData>({
      resolver: yupResolver(schema),
      shouldFocusError: false,
      defaultValues: {
        brand: "",
        model: "",
        plateNumber: "",
        transmissionType: "automatic",
        comprehensiveInsurance: false,
        iconName: "Sedan",
      },
    });

    const { bottom } = useSafeAreaInsets();
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      []
    );

    const handleSubmit = onSubmit((data) => {
      mutation.mutate(
        {
          brand: data.brand,
          model: data.model,
          plateNumber: data.plateNumber,
          isManual: data.transmissionType === "manual",
          hasInsurance: data.comprehensiveInsurance,
          iconName: data.iconName,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getVehicles"] });
            bottomSheetRef.current?.dismiss();
          },
        }
      );
    });

    return (
      <BottomSheetModal
        enablePanDownToClose
        enableDynamicSizing
        ref={ref}
        index={0}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        onDismiss={() => {
          reset();
        }}
      >
        <BottomSheetView style={{ paddingBottom: bottom }}>
          <View className="gap-y-6 px-4 py-6">
            <Controller
              control={control}
              name="brand"
              render={({
                fieldState: { error },
                field: { onChange, value, onBlur },
              }) => (
                <View>
                  <Label className="ml-2">Car Brand</Label>
                  <BottomSheetInput
                    placeholder="Enter Car Brand"
                    className="border-0 border-b border-b-border"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      inputRefs.current[1]?.focus();
                    }}
                    ref={(r) => {
                      if (r) {
                        inputRefs.current[0] = r;
                      }
                    }}
                  />
                  {error && (
                    <Text className="text-destructive text-sm mt-2 ml-2">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="model"
              render={({
                fieldState: { error },
                field: { onChange, value, onBlur },
              }) => (
                <View>
                  <Label className="ml-2">Car Model</Label>
                  <BottomSheetInput
                    placeholder="Enter Car Model"
                    className="border-0 border-b border-b-border"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      inputRefs.current[2]?.focus();
                    }}
                    ref={(r) => {
                      if (r) {
                        inputRefs.current[1] = r;
                      }
                    }}
                  />
                  {error && (
                    <Text className="text-destructive text-sm mt-2 ml-2">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="plateNumber"
              render={({
                fieldState: { error },
                field: { onChange, value, onBlur },
              }) => (
                <View>
                  <Label className="ml-2">Plate Number</Label>
                  <BottomSheetInput
                    placeholder="Enter Plate Number"
                    className="border-0 border-b border-b-border"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      inputRefs.current[2]?.blur();
                    }}
                    ref={(r) => {
                      if (r) {
                        inputRefs.current[2] = r;
                      }
                    }}
                  />
                  {error && (
                    <Text className="text-destructive text-sm mt-2 ml-2">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="iconName"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Label className="ml-2">Vehicle Type</Label>
                  <ScrollView
                    horizontal
                    className="mt-2 ml-2"
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="gap-x-2"
                  >
                    {vehicleTypes.map((vehicle) => (
                      <Button
                        key={vehicle.name}
                        onPress={() => onChange(vehicle.name)}
                        variant={"outline"}
                        className={cn(
                          "flex-row items-center gap-x-2",
                          value === vehicle.name && "border-primary"
                        )}
                      >
                        <Image
                          source={vehicle.icon}
                          className="w-12 h-12"
                          resizeMode="contain"
                        />
                        <Text>{vehicle.name}</Text>
                      </Button>
                    ))}
                  </ScrollView>
                </View>
              )}
            />

            <Controller
              control={control}
              name="transmissionType"
              render={({
                fieldState: { error },
                field: { onChange, value },
              }) => (
                <View>
                  <Label className="ml-2">Transmission Type</Label>
                  <View className="flex-row gap-x-2 ml-2 mt-2">
                    <Button
                      size="sm"
                      variant={value === "automatic" ? "default" : "outline"}
                      onPress={() => onChange("automatic")}
                    >
                      <Text>Automatic</Text>
                    </Button>

                    <Button
                      size="sm"
                      variant={value === "manual" ? "default" : "outline"}
                      onPress={() => onChange("manual")}
                    >
                      <Text>Manual</Text>
                    </Button>
                  </View>
                  {error && (
                    <Text className="text-destructive text-sm mt-2 ml-2">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="comprehensiveInsurance"
              render={({
                fieldState: { error },
                field: { onChange, value },
              }) => (
                <View>
                  <Label className="ml-2">
                    Do you have comprehensive insurance?
                  </Label>
                  <View className="flex-row gap-x-2 ml-2 mt-2">
                    <Button
                      size="sm"
                      variant={value ? "default" : "outline"}
                      onPress={() => onChange(true)}
                    >
                      <Text>Yes</Text>
                    </Button>

                    <Button
                      size="sm"
                      variant={!value ? "default" : "outline"}
                      onPress={() => onChange(false)}
                    >
                      <Text>No</Text>
                    </Button>
                  </View>
                  {error && (
                    <Text className="text-destructive text-sm mt-2 ml-2">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Button
              className="mt-6"
              onPress={handleSubmit}
              disabled={isSubmitted && !isValid}
            >
              <Text>Save</Text>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default VehicleCreateBottomSheet;
