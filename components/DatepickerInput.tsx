import { Modal, Platform, TouchableWithoutFeedback, View } from "react-native";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
};

export function DatepickerInput({ value, onChange }: Props) {
  const [position, setPosition] = useState<{
    y: number;
    x: number;
    width: number;
  }>({
    y: 0,
    x: 0,
    width: 0,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const triggerRef = useRef<View>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setPosition({ x: pageX, y: pageY + height, width });
      });
    }
  }, [isOpen]);

  return (
    <View>
      <View className="relative" ref={triggerRef}>
        <Text className="text-sm text-muted-foreground ml-2 font-medium">
          Date of birth
        </Text>
        <Input
          className="border-0 border-b border-border"
          placeholder="DD/MM/YYYY"
          readOnly
          value={value?.toLocaleDateString("en-GB") ?? ""}
        />

        <Button
          size="icon"
          variant="ghost"
          className="absolute right-0 top-1/2 -translate-y-1/2"
          onPress={() => setIsOpen(!isOpen)}
        >
          <ChevronDown className="text-primary" />
        </Button>
      </View>

      {isOpen && Platform.OS === "ios" && (
        <Modal transparent visible={isOpen} animationType="fade">
          <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
            <View className="flex-1">
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <Card
                  className="absolute items-center justify-center mt-2"
                  style={{
                    top: position.y,
                    left: position.x,
                    width: position.width,
                  }}
                >
                  <DateTimePicker
                    value={value ?? new Date()}
                    mode="date"
                    display="inline"
                    style={{ width: "100%" }}
                    onChange={(event, date) => {
                      if (date) {
                        onChange(date);
                      }
                    }}
                  />
                </Card>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {isOpen && Platform.OS === "android" && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          onChange={(event, date) => {
            if (date) {
              setIsOpen(false);
              onChange(date);
            }
          }}
          display="calendar"
          style={{ width: "100%" }}
        />
      )}
    </View>
  );
}
