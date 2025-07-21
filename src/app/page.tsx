import Map from "@/components/Map";

import { world } from "@/data/world-medium-resolution";
import { buildMapCountries } from "@/utils";
import { useMemo } from "react";

export default function Home() {
  const mapData = useMemo(() => buildMapCountries(world), []);

  return (
    <div>
      <main>Countries Grid</main>
      <Map countries={mapData} />
    </div>
  );
}
