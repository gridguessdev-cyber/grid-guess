"use client";

import { getLevels } from "@/lib/levels";
import { useQuery } from "@tanstack/react-query";

export default function LevelsList() {
  const { data: levels } = useQuery({
    queryKey: ["levels"],
    queryFn: getLevels,
  });

  if (!levels) return;

  return (
    <div>
      {levels.map((level) => (
        <div key={level.id}>{level.country}</div>
      ))}
    </div>
  );
}
