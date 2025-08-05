import { buildMapCountries } from "@/utils";
import africaLow from "./africa/africa-low.json";
import africaMedium from "./africa/africa-medium.json";

import asiaLow from "./asia/asia-low.json";
import asiaMedium from "./asia/asia-medium.json";

import europeLow from "./europe/europe-low.json";
import europeMedium from "./europe/europe-medium.json";

import northAmericaLow from "./northAmerica/north-america-low.json";
import northAmericaMedium from "./northAmerica/north-america-medium.json";

import southAmericaLow from "./southAmerica/south-america-low.json";
import southAmericaMedium from "./southAmerica/south-america-medium.json";

import worldLow from "./world/world-low.json";
import worldMedium from "./world/world-medium.json";

export const maps = {
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
