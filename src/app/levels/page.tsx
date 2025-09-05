import { getQueryClient } from "../get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import LevelsList from "@/components/LevelsList";
import { createClient } from "@/utils/supabase/server";
import { LevelsService } from "@/lib/LevelsService";

export default async function Levels() {
  const supabase = await createClient();
  const levelsService = new LevelsService(supabase);

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["levels"],
    queryFn: () => levelsService.getLevels(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LevelsList />
    </HydrationBoundary>
  );
}
