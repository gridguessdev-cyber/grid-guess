import Map from "@/components/Map";

import { world as worldMediumResolution } from "@/data/world-medium-resolution";
import { world as worldLowResolution } from "@/data/world-low-resolution";
import { buildMapCountries } from "@/utils";
import { useMemo } from "react";

export default function Home() {
  const mapDataMedium = useMemo(
    () => buildMapCountries(worldMediumResolution),
    []
  );
  const mapDataLow = useMemo(() => buildMapCountries(worldLowResolution), []);

  return (
    <div>
      <main>Countries Grid</main>
      <Map
        countriesToDisplay={mapDataMedium}
        countriesForCalculations={mapDataLow}
      />
    </div>
  );
}
