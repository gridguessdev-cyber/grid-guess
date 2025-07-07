import Map from "@/components/Map";

import { world } from "@/data/world";
import { buildMapCountries } from "@/utils";
import { useMemo } from "react";

export default function Home() {
  const data = useMemo(() => buildMapCountries(world), []);

  return (
    <div>
      <main>Countries Grid</main>
      <Map countries={data} />
    </div>
  );
}
