"use client";
import Map from "@/components/Map";

import { useMapStore } from "@/providers/MapStoreProvider";
import { maps } from "@/data/exports";

export default function Home() {
  const { map } = useMapStore((state) => state);

  return (
    <main>
      <Map
        key={map}
        countriesToDisplay={maps[map].display}
        countriesForCalculations={maps[map].calculations}
      />
    </main>
  );
}
