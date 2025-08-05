"use client";
import { createMapStore, MapStore } from "@/store/mapStore";
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type MapStoreApi = ReturnType<typeof createMapStore>;

const StoreContext = createContext<MapStoreApi | null>(null);

export const MapStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<MapStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createMapStore();
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useMapStore = <T,>(selector: (store: MapStore) => T): T => {
  const storeContext = useContext(StoreContext);

  if (!storeContext) throw new Error("Store is not available");

  return useStore(storeContext, selector);
};
