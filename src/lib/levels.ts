import { CreateLevelParams, Level } from "@/types/api";
import { instance } from "./baseInstance";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

export const getLevels = async (
  client: SupabaseClient<Database>
): Promise<Level[]> =>
  // (await instance.get("/api/levels")).data;
  (await client.from("levels").select("*")).data!;

export const getLevelById = async (
  client: SupabaseClient<Database>,
  id: string
): Promise<Level> =>
  // (await instance.get(`/api/levels/${id}`)).data[0];
  // (await client.from("levels").select("*").eq("id", id)).data;
  (await client.from("levels").select("*").eq("id", id)).data![0];

export const createLevel = async (
  createLevelParams: CreateLevelParams
): Promise<Level> =>
  (await instance.post("/api/levels", createLevelParams)).data;
