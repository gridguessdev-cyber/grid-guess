import { User } from "@supabase/supabase-js";
import { StateCreator } from "zustand";

export type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const createAuthSlice: StateCreator<AuthState, [], [], AuthState> = (
  set
) => ({
  user: null,
  setUser: (user) => set({ user }),
});
