import { CountriesCollection, MapCountry } from "@/types/maps";

export const buildMapCountries = (
  collection: CountriesCollection
): MapCountry[] => {
  return collection.features.map((feature) => {
    return {
      name: feature.properties.name,
      id: feature.properties.id,
      coordinates:
        feature.geometry.type === "Polygon"
          ? ([feature.geometry.coordinates] as [number, number][][][])
          : (feature.geometry.coordinates as [number, number][][][]),
    };
  });
};
