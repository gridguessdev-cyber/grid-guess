"use client";
import Map from "@/components/Map";

import { useMapStore } from "@/providers/MapStoreProvider";
import { maps } from "@/data/exports";

export default function Builder() {
  const { map } = useMapStore((state) => state);

  return (
    <Map
      key={map}
      mode="build"
      countriesToDisplay={maps[map].display}
      countriesForCalculations={maps[map].calculations}
    />
  );
}
