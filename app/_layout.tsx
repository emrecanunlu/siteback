import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { router, Slot, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Alert, Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AuthProvider, useAuth } from "~/providers/auth-providers";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Constants from "expo-constants";
import { LogLevel, OneSignal } from "react-native-onesignal";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  }),
  queryCache: new QueryCache({
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  }),
});

const InitialLayout = () => {
  const hasMounted = React.useRef<boolean>(false);
  const { user, loading } = useAuth();
  const segments = useSegments();

  const initOneSignal = () => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(Constants.expoConfig?.extra?.oneSignalAppId);

    // Also need enable notifications to complete OneSignal setup
    OneSignal.Notifications.requestPermission(true);
  };

  // İlk yükleme için useEffect
  React.useEffect(() => {
    if (loading) {
      return;
    }

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";

    if (inAuthGroup && user) {
      router.replace("/");
    } else if (!inAuthGroup && !user) {
      router.replace("/welcome");
    }

    hasMounted.current = true;
  }, [loading, user]);

  React.useEffect(() => {
    if (hasMounted.current) {
      initOneSignal();
    }
  }, [hasMounted.current]);

  return <Slot />;
};

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <AuthProvider>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              <InitialLayout />
              <PortalHost />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
