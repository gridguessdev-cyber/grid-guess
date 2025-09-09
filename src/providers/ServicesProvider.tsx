"use client";
import { LevelsService } from "@/lib/LevelsService";
import { UsersService } from "@/lib/UsersService";
import { createClient } from "@/utils/supabase/client";
import { createContext, useContext } from "react";

interface Props {
  children: React.ReactNode;
}

export const ServicesContext = createContext<{
  levelsService: LevelsService;
  usersService: UsersService;
} | null>(null);

export function ServicesProvider({ children }: Props) {
  const supabase = createClient();
  const levelsService = new LevelsService(supabase);
  const usersService = new UsersService(supabase);

  return (
    <ServicesContext.Provider value={{ levelsService, usersService }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error("useServices must be used within ServicesProvider");
  }
  return context;
}
