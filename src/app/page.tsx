"use client";
import Map from "@/components/Map";

import { world as worldLowResolution } from "@/data/world-low-resolution";
import { buildMapCountries } from "@/utils";
import { useMemo } from "react";

import coastline from "../../output/coastline.json";
import { MapCountry } from "@/types/maps";

export default function Home() {
  const mapDataLow = useMemo(() => buildMapCountries(worldLowResolution), []);

  return (
    <div>
      <main>Countries Grid</main>
      <Map
        countriesToDisplay={coastline as MapCountry[]}
        countriesForCalculations={mapDataLow}
      />
    </div>
  );
}
