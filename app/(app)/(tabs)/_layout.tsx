import { Tabs } from "expo-router";
import { CarFront } from "~/lib/icons/Car";
import { Home } from "~/lib/icons/Home";
import { Ticket } from "~/lib/icons/Tickets";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: "bottom",
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: () => <Home className="text-primary" />,
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="vehicle"
        options={{
          tabBarIcon: () => <CarFront className="text-primary" />,
          tabBarLabel: "Vehicle",
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          tabBarIcon: () => <Ticket className="text-primary" />,
          tabBarLabel: "Trips",
        }}
      />
    </Tabs>
  );
}
