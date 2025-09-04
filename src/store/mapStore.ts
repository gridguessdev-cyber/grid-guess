import { StateCreator } from "zustand";

export type MapState = {
  map: string;
  setMap: (map: string) => void;
};

export const createMapSlice: StateCreator<MapState, [], [], MapState> = (
  set
) => ({
  map: "world",
  setMap: (map) => set({ map }),
});
