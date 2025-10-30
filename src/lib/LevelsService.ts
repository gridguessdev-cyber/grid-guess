import { CreateLevelParams, Level } from "@/types/api";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import _ from "lodash";

type GetLevelsParams = {
  map: string;
  listingType: "all" | "my-levels";
};

export class LevelsService {
  constructor(private client: SupabaseClient<Database>) {}

  async getLevels(params?: GetLevelsParams): Promise<Level[]> {
    try {
      let levelsPromise = this.client.from("levels").select("*");

      if (params?.map && params.map !== "All") {
        levelsPromise = levelsPromise.eq(
          "map",
          _.camelCase(params.map.replace(/\s/g, ""))
        );
      }

      if (params?.listingType === "my-levels") {
        const user = await this.client.auth.getUser();
        const userId = user.data.user?.id;
        if (userId) {
          levelsPromise = levelsPromise.eq("author", userId);
        }
      }

      const { data: levels } = await levelsPromise;

      return levels!;
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

  async deleteLevel(id: string): Promise<void> {
    await this.client.from("levels").delete().eq("id", id);
  }
}
