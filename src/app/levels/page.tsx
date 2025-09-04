import { getLevels } from "@/lib/levels";
import { getQueryClient } from "../get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import LevelsList from "@/components/LevelsList";
import { createClient } from "@/utils/supabase/server";
import { Database } from "../../../database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export default async function Levels() {
  const queryClient = getQueryClient();
  const supabaseClient: SupabaseClient<Database> = createClient();

  await queryClient.prefetchQuery({
    queryKey: ["levels"],
    queryFn: () => getLevels(supabaseClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LevelsList />
    </HydrationBoundary>
  );
}
