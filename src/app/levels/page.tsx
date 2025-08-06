import { getLevels } from "@/lib/levels";
import { getQueryClient } from "../get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import LevelsList from "@/components/LevelsList";

export default async function Levels() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["levels"],
    queryFn: getLevels,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LevelsList />
    </HydrationBoundary>
  );
}
