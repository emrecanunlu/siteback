import { useCallback, useEffect, useRef, useState } from "react";
import { View, TextInput, Platform } from "react-native";
import { BottomSheetInput } from "./ui/bottomsheet-input";
import { useKeyboard } from "~/lib/keyboard";
import { Input } from "./ui/input";

interface OtpInputProps {
  onComplete?: (code: string) => void;
  autofocus?: boolean;
  isBottomSheet?: boolean;
}

export const OtpInput = ({
  onComplete,
  autofocus = false,
  isBottomSheet = false,
}: OtpInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<TextInput[]>([]);
  const { dismissKeyboard } = useKeyboard();

  const InputComponent = isBottomSheet ? BottomSheetInput : Input;

  const handleChange = useCallback(
    (value: string, index: number) => {
      const newOtp = [...otp];

      // iOS için OTP otomatik doldurma kontrolü
      if (Platform.OS === "ios" && value.length > 1) {
        const digits = value.split("");
        digits.forEach((digit, i) => {
          if (i < 6) {
            newOtp[i] = digit;
          }
        });
        setOtp(newOtp);

        if (onComplete && digits.length === 6) {
          onComplete(digits.join(""));
          dismissKeyboard();
        }
        return;
      }

      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit) && onComplete) {
        onComplete(newOtp.join(""));
        dismissKeyboard();
      }
    },
    [otp, onComplete]
  );

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  useEffect(() => {
    if (autofocus) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, []);

  return (
    <View className="flex-row gap-x-3">
      {otp.map((digit, index) => (
        <InputComponent
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref as TextInput)}
          className={`flex-1 aspect-square text-center rounded-xl ${
            focusedIndex === index
              ? "border-2 border-primary"
              : "border border-border"
          }`}
          maxLength={Platform.OS === "ios" ? 6 : 1}
          keyboardType="number-pad"
          value={digit}
          onChangeText={(value) => handleChange(value, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
          selectTextOnFocus
          textContentType={Platform.OS === "ios" ? "oneTimeCode" : undefined}
        />
      ))}
    </View>
  );
};
