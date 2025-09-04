import { create } from "zustand";
import { createMapSlice, MapState } from "./mapStore";
import { createAuthSlice, AuthState } from "./authStore";

type CombinedStore = MapState & AuthState;

export const useStore = create<CombinedStore>()((...a) => ({
  ...createMapSlice(...a),
  ...createAuthSlice(...a),
}));
