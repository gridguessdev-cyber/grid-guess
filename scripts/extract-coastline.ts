// @ts-nocheck
import fs from "fs";
import { buildMapCountries } from "@/utils";
// import { world } from "../src/data/world-medium-resolution";
import world from "../src/data/asia/asia-medium";

const map = buildMapCountries(world);

const coastLineMap = [];
map.forEach((country) => {
  const currentCountryCoastLine = [];
  country.coordinates.forEach((coordinates) => {
    const temp = [[]];
    coordinates.forEach((pairs) => {
      pairs.forEach((pair) => {
        const [x, y] = pair;
        let check = true;
        map.forEach((countryToCheckBordering) => {
          if (countryToCheckBordering.name === country.name) {
            return;
          }

          countryToCheckBordering.coordinates.forEach(
            (countryToCheckCoordinates) => {
              countryToCheckCoordinates.forEach(
                (countryToCheckCoordinatesPairs) => {
                  countryToCheckCoordinatesPairs.forEach(
                    (countryToCheckCoordinatesPair) => {
                      const [
                        countryToCheckCoordinatesX,
                        countryToCheckCoordinatesY,
                      ] = countryToCheckCoordinatesPair;
                      if (
                        x === countryToCheckCoordinatesX &&
                        y === countryToCheckCoordinatesY
                      ) {
                        check = false;
                      }
                    }
                  );
                }
              );
            }
          );
        });

        if (check) {
          temp[temp.length - 1].push([x, y]);
        } else if (temp[temp.length - 1] !== 0) {
          temp.push([]);
        }
      });
    });
    const filtered = temp.filter((arr) => arr.length);
    if (filtered[0]) {
      currentCountryCoastLine.push(...filtered);
    }
  });

  if (!currentCountryCoastLine[0]) return;
  coastLineMap.push({
    name: country.name,
    coordinates: [currentCountryCoastLine],
  });
});

fs.writeFile(
  "output/coastline.json",
  JSON.stringify(coastLineMap),
  console.log
);
