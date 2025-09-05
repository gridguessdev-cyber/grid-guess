import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createMapSlice, MapState } from "./mapStore";
import { createAuthSlice, AuthState } from "./authStore";

type CombinedStore = MapState & AuthState;

export const useStore = create<CombinedStore>()((...a) => ({
  ...persist(createMapSlice, { name: "map" })(...a),
  ...persist(createAuthSlice, { name: "auth" })(...a),
}));
