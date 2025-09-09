import { UserProfile } from "@/types/api";
import { StateCreator } from "zustand";

export type AuthState = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

export const createAuthSlice: StateCreator<AuthState, [], [], AuthState> = (
  set
) => ({
  user: null,
  setUser: (user) => set({ user }),
});
