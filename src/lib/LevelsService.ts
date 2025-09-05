import { CreateLevelParams, Level } from "@/types/api";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

export class LevelsService {
  constructor(private client: SupabaseClient<Database>) {}

  async getLevels(): Promise<Level[]> {
    try {
      const levels = (await this.client.from("levels").select("*")).data!;
      return levels;
    } catch (error) {
      console.error("Error fetching levels:", error);
      throw error;
    }
  }

  async getLevelById(id: string): Promise<Level> {
    return (await this.client.from("levels").select("*").eq("id", id)).data![0];
  }

  async createLevel(createLevelParams: CreateLevelParams): Promise<Level> {
    return (await this.client.from("levels").insert(createLevelParams)).data!;
  }
}
