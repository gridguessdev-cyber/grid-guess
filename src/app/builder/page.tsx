"use client";
import { useEffect, useState } from "react";
import Map from "@/components/Map";
import { maps } from "@/data/exports";
import { useStore } from "@/store/store";

export default function Builder() {
  const { map } = useStore((state) => state);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!map) return <div>Please select a map</div>;

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
