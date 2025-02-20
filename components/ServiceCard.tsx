import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Text } from "./ui/text";
import { Image, ImageSourcePropType } from "react-native";
type Props = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  onPress: () => void;
};

export default function ServiceCard({
  title,
  description,
  image,
  onPress,
}: Props) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-primary/60">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          className="native:h-10 native:py-0 flex-row items-center"
          onPress={onPress}
        >
          <Text>Book | Schedule</Text>
          <ChevronRight size={16} className="text-primary-foreground ml-4" />
        </Button>
      </CardFooter>

      <Image
        source={image}
        className="absolute -bottom-2 -right-2 w-32 h-32"
        resizeMode="contain"
      />
    </Card>
  );
}
