import { buildMapCountries } from "@/utils";
import { africaLow } from "./africa/africa-low";

import { asiaLow } from "./asia/asia-low";
import { europeLow } from "./europe/europe-low";
import { northAmericaLow } from "./northAmerica/north-america-low";
import { southAmericaLow } from "./southAmerica/south-america-low";
import { worldLow } from "./world/world-low";

import { africaCoastline } from "./africa/africa-coastline";
import { asiaCoastline } from "./asia/asia-coastline";
import { europeCoastline } from "./europe/europe-coastline";
import { northAmericaCoastline } from "./northAmerica/north-america-coastline";
import { southAmericaCoastline } from "./southAmerica/south-america-coastline";
import { worldCoastline } from "./world/world-coastline";

import { MapCountry } from "@/types/maps";
import { africaMedium } from "./africa/africa-medium";
import { asiaMedium } from "./asia/asia-medium";
import { europeMedium } from "./europe/europe-medium";
import { northAmericaMedium } from "./northAmerica/north-america-medium";
import { southAmericaMedium } from "./southAmerica/south-america-medium";
import { worldMedium } from "./world/world-medium";

export const maps: Record<
  string,
  {
    display: MapCountry[];
    calculations: MapCountry[];
    displayIndividualCountries: MapCountry[];
  }
> = {
  africa: {
    display: africaCoastline,
    calculations: buildMapCountries(africaLow),
    displayIndividualCountries: buildMapCountries(africaMedium),
  },
  asia: {
    display: asiaCoastline,
    calculations: buildMapCountries(asiaLow),
    displayIndividualCountries: buildMapCountries(asiaMedium),
  },
  europe: {
    display: europeCoastline,
    calculations: buildMapCountries(europeLow),
    displayIndividualCountries: buildMapCountries(europeMedium),
  },
  northAmerica: {
    // display: northAmericaCoastline,
    // calculations: buildMapCountries(northAmericaLow),
    // displayIndividualCountries: buildMapCountries(northAmericaMedium),
    display: buildMapCountries(northAmericaLow),
    calculations: buildMapCountries(northAmericaLow),
    displayIndividualCountries: buildMapCountries(northAmericaLow),
  },
  southAmerica: {
    display: southAmericaCoastline,
    calculations: buildMapCountries(southAmericaLow),
    displayIndividualCountries: buildMapCountries(southAmericaMedium),
  },
  world: {
    display: worldCoastline,
    calculations: buildMapCountries(worldLow),
    displayIndividualCountries: buildMapCountries(worldMedium),
  },
};
