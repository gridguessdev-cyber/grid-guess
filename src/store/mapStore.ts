import { createStore } from "zustand/vanilla";

export type MapState = {
  map: string;
};

export type MapActions = {
  setMap: (map: string) => void;
};

export type MapStore = MapState & MapActions;

export const initialState: MapState = {
  map: "world",
};

export const createMapStore = (initState: MapState = initialState) => {
  return createStore<MapStore>()((set) => ({
    ...initState,
    setMap: (map) => set(() => ({ map })),
  }));
};
