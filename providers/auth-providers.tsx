import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "~/types/User";
import { getUser } from "~/services/user-service";
import { refreshToken as getRefreshToken } from "~/services/auth-service";
import { LoginTokenResponse } from "~/types/Auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (accessToken: string, refreshToken: string) => void;
  signOut: () => void;
  updateUser: (tokenResponse: LoginTokenResponse, user: User) => void;
  refreshToken: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getUserCredentials = async () => {
    try {
      setLoading(true);

      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) return;

      const response = await getUser();

      setUser(response.data ?? null);
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);

    await getUserCredentials();
  };

  const updateUser = async (tokenResponse: LoginTokenResponse, user: User) => {
    await AsyncStorage.setItem("accessToken", tokenResponse.accessToken);
    await AsyncStorage.setItem("refreshToken", tokenResponse.refreshToken);

    console.log("user", user);
    setUser(user);
  };

  const refreshToken = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const accessToken = await AsyncStorage.getItem("accessToken");

    if (!refreshToken || !accessToken) return;

    getRefreshToken({ accessToken, refreshToken })
      .then(async (response) => {
        if (response.data) {
          console.log("tokenResponse", response.data.tokenResponse);
          console.log("user", response.data.user);

          await AsyncStorage.setItem(
            "accessToken",
            response.data.tokenResponse.accessToken
          );
          await AsyncStorage.setItem(
            "refreshToken",
            response.data.tokenResponse.refreshToken
          );

          setUser(response.data.user);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");

    setUser(null);
  };

  useEffect(() => {
    getUserCredentials();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signOut, updateUser, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
