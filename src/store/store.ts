import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createMapSlice, MapState } from "./mapStore";
import { createAuthSlice, AuthState } from "./authStore";

type CombinedStore = MapState & AuthState;

export const useStore = create<CombinedStore>()(
  persist(
    (...a) => ({
      ...createMapSlice(...a),
      ...createAuthSlice(...a),
    }),
    {
      name: "store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
