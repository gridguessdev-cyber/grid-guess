"use client";
import Map from "@/components/Map";

import { world as worldLowResolution } from "@/data/world-low-resolution";
import { world as worldMediumResolution } from "@/data/world-medium-resolution";
import { buildMapCountries } from "@/utils";
import { useMemo } from "react";

import coastline from "../../output/coastline.json";
import africaLow from "../data/africa/africa-low.json";
import africaMedium from "../data/africa/africa-medium.json";
import asiaLow from "../data/asia/asia-low.json";
import asiaMedium from "../data/asia/asia-medium.json";
import europeLow from "../data/europe/europe-low.json";
import europeMedium from "../data/europe/europe-medium.json";
import southAmericaLow from "../data/southAmerica/south-america-low.json";
import southAmericaMedium from "../data/southAmerica/south-america-medium.json";
import northAmericaLow from "../data/northAmerica/north-america-low.json";
import { MapCountry } from "@/types/maps";

export default function Home() {
  const mapDataLow = useMemo(() => buildMapCountries(africaLow), []);
  const mapDataMedium = useMemo(() => buildMapCountries(africaMedium), []);

  return (
    <main>
      <Map
        // countriesToDisplay={coastline as MapCountry[]}
        countriesToDisplay={mapDataMedium}
        countriesForCalculations={mapDataLow}
      />
    </main>
  );
}
