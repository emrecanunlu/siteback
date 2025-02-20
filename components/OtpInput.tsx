import { useCallback, useEffect, useRef, useState } from "react";
import { View, TextInput } from "react-native";
import { Input } from "./ui/input";
import { useKeyboard } from "~/lib/keyboard";

interface OtpInputProps {
  onComplete?: (code: string) => void;
}

export const OtpInput = ({ onComplete }: OtpInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<TextInput[]>([]);

  const { dismissKeyboard } = useKeyboard();

  const handleChange = useCallback(
    (value: string, index: number) => {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Sonraki input'a geç
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // Tüm inputlar dolduysa onComplete'i çağır
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
    // İlk input'a otomatik fokus
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  return (
    <View className="flex-row gap-x-3">
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref as TextInput)}
          className={`flex-1 aspect-square text-center rounded-xl ${
            focusedIndex === index
              ? "border-2 border-primary"
              : "border border-border"
          }`}
          maxLength={1}
          keyboardType="number-pad"
          value={digit}
          onChangeText={(value) => handleChange(value, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};
