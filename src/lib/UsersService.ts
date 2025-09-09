import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { UserProfile } from "@/types/api";

export class UsersService {
  constructor(private client: SupabaseClient<Database>) {}

  async authorizeIdToken(idToken: string): Promise<User | null> {
    const { data, error } = await this.client.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });
    if (error) {
      console.error("Error during sign-in:", error.message);
      return null;
    }
    return data.user;
  }

  async getUser(id: string): Promise<UserProfile | null> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }
    return data;
  }

  async editUserDetails(details: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await this.client
      .from("profiles")
      .update(details)
      .eq("id", details?.id || "")
      .select()
      .single();
    if (error) {
      console.error("Error updating user details:", error.message);
      throw error;
    }
    return data;
  }
}
