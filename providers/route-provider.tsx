import { createContext, useContext, useState } from "react";
import { Currency } from "~/types/Enum";
import { SelectedLocation } from "~/types/Map";

type RouteContextType = {
  pickupLocation: SelectedLocation | null;
  dropoffLocation: SelectedLocation | null;
  currencyType: Currency;
  setPickupLocation: (location: SelectedLocation | null) => void;
  setDropoffLocation: (location: SelectedLocation | null) => void;
  setCurrencyType: (currencyType: Currency) => void;
};

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider = ({ children }: { children: React.ReactNode }) => {
  const [currencyType, setCurrencyType] = useState<Currency>(Currency.USD);
  const [pickupLocation, setPickupLocation] = useState<SelectedLocation | null>(
    null
  );
  const [dropoffLocation, setDropoffLocation] =
    useState<SelectedLocation | null>(null);

  return (
    <RouteContext.Provider
      value={{
        pickupLocation,
        dropoffLocation,
        setPickupLocation,
        setDropoffLocation,
        currencyType,
        setCurrencyType,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
};
