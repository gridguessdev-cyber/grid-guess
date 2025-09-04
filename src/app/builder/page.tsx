"use client";
import Map from "@/components/Map";

import { maps } from "@/data/exports";
import { useStore } from "@/store/store";

export default function Builder() {
  const { map } = useStore((state) => state);

  return (
    <Map
      key={map}
      mode="build"
      countriesToDisplay={maps[map].display}
      countriesForCalculations={maps[map].calculations}
      displayIndividualCountries={maps[map].displayIndividualCountries}
    />
  );
}
