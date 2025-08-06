import { buildMapCountries } from "@/utils";
import { africaLow } from "./africa/africa-low";
import { africaMedium } from "./africa/africa-medium";

import { asiaLow } from "./asia/asia-low";
import { asiaMedium } from "./asia/asia-medium";

import { europeLow } from "./europe/europe-low";
import { europeMedium } from "./europe/europe-medium";

import { northAmericaLow } from "./northAmerica/north-america-low";
import { northAmericaMedium } from "./northAmerica/north-america-medium";

import { southAmericaLow } from "./southAmerica/south-america-low";
import { southAmericaMedium } from "./southAmerica/south-america-medium";

import { worldLow } from "./world/world-low";
import { worldMedium } from "./world/world-medium";

import { MapCountry } from "@/types/maps";

export const maps: Record<
  string,
  { display: MapCountry[]; calculations: MapCountry[] }
> = {
  africa: {
    display: buildMapCountries(africaMedium),
    calculations: buildMapCountries(africaLow),
  },
  asia: {
    display: buildMapCountries(asiaMedium),
    calculations: buildMapCountries(asiaLow),
  },
  europe: {
    display: buildMapCountries(europeMedium),
    calculations: buildMapCountries(europeLow),
  },
  northAmerica: {
    display: buildMapCountries(northAmericaMedium),
    calculations: buildMapCountries(northAmericaLow),
  },
  southAmerica: {
    display: buildMapCountries(southAmericaMedium),
    calculations: buildMapCountries(southAmericaLow),
  },
  world: {
    display: buildMapCountries(worldMedium),
    calculations: buildMapCountries(worldLow),
  },
};
