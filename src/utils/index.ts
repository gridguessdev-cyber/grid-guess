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

const DURATION = 50;

const throttle = (function () {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function throttle(callback: () => void) {
    if (!timeout) {
      callback();
      timeout = setTimeout(() => {
        timeout = null;
      }, DURATION);
    }
  };
})();

export const throttlify = (callback: (event: Event) => void) => {
  return function throttlified(event: Event) {
    throttle(() => {
      callback(event);
    });
  };
};
