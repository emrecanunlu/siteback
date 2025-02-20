import { ActivityIndicator, Modal, View } from "react-native";

type Props = {
  loading: boolean;
};

export default function AppLoader({ loading }: Props) {
  return (
    <Modal transparent={true} visible={loading} animationType="fade">
      <View className="flex-1 justify-center items-center bg-primary/70 dark:bg-background/70">
        <ActivityIndicator className="text-primary-foreground dark:text-primary" />
      </View>
    </Modal>
  );
}
