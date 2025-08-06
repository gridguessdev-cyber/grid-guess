import { CountriesCollection, MapCountry } from "@/types/maps";

export const buildMapCountries = (
  collection: CountriesCollection
): MapCountry[] => {
  const countries = collection.features.map((feature) => {
    return {
      name: feature.properties.name,
      id: feature.properties.id,
      coordinates:
        feature.geometry.type === "Polygon"
          ? ([feature.geometry.coordinates] as [number, number][][][])
          : (feature.geometry.coordinates as [number, number][][][]),
    };
  });

  const edgeCoordinates = getEdgePointsCoordinates(
    countries.map((country) => ({
      name: country.name,
      id: country.id,
      coordinates: country.coordinates.map((arr) => {
        return arr.map((pairs) => {
          return pairs.map((pair) => {
            return [pair[0] + 180, -(pair[1] - 90)];
          });
        });
      }),
    }))
  );

  return countries.map((country) => ({
    name: country.name,
    id: country.id,
    coordinates: country.coordinates.map((arr) => {
      return arr.map((pairs) => {
        return pairs.map((pair) => {
          return [
            pair[0] + 180 - edgeCoordinates.smallestX,
            -(pair[1] - 90) - edgeCoordinates.smallestY,
          ];
        });
      });
    }),
  }));
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

export const calculatePolygonArea = (polygon: [number, number][][]): number => {
  let area = 0;
  const points = polygon[0];

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const p1 = points[i];
    const p2 = points[j];
    area += (p2[0] + p1[0]) * (p2[1] - p1[1]);
  }

  return Math.abs(area / 2);
};

type calculateCountryCellAreaParams = {
  squareSize: number;
  verticalShift: number;
  horizontalShift: number;
  clickCoordinates: [number, number];
};

export const getClickedSquareSides = ({
  squareSize,
  verticalShift,
  horizontalShift,
  clickCoordinates,
}: calculateCountryCellAreaParams) => {
  const [x, y] = clickCoordinates;
  let squareTopCoordinates,
    squareBottomCoordinates,
    squareLeftCoordinates,
    squareRightCoordinates;
  let squareTop = Math.floor((squareSize - verticalShift + y) / squareSize) - 1;
  let squareBottom =
    Math.ceil((squareSize - Math.abs(verticalShift) + y) / squareSize) - 1;
  let squareLeft =
    Math.floor((squareSize - horizontalShift + x) / squareSize) - 1;
  let squareRight =
    Math.ceil((squareSize - Math.abs(horizontalShift) + x) / squareSize) - 1;

  squareTopCoordinates = squareTop * squareSize + verticalShift;
  squareBottomCoordinates = squareBottom * squareSize + verticalShift;
  if (verticalShift > 0) {
    squareTop++;
    squareBottom++;
  }

  if (verticalShift !== 0 && squareTop === 0) {
    squareTopCoordinates = 0;
    squareBottomCoordinates = Math.abs(verticalShift);
  }

  squareLeftCoordinates = squareLeft * squareSize + horizontalShift;
  squareRightCoordinates = squareRight * squareSize + horizontalShift;
  if (horizontalShift > 0) {
    squareLeft++;
    squareRight++;
  }

  if (horizontalShift !== 0 && squareLeft === 0) {
    squareLeftCoordinates = 0;
    squareRightCoordinates = Math.abs(horizontalShift);
  }

  return {
    squareTopCoordinates,
    squareBottomCoordinates,
    squareLeftCoordinates,
    squareRightCoordinates,
  };
};

export const getEdgePointsCoordinates = (map: MapCountry[]) => {
  const firstPoint = map[0].coordinates[0][0][0];
  const result = {
    smallestX: firstPoint[0],
    largestX: firstPoint[0],
    smallestY: firstPoint[1],
    largestY: firstPoint[1],
  };

  map.forEach((country) => {
    country.coordinates.flat(2).forEach((pair) => {
      if (result.largestX < pair[0]) {
        result.largestX = pair[0];
      }

      if (result.largestY < pair[1]) {
        result.largestY = pair[1];
      }

      if (result.smallestX > pair[0]) {
        result.smallestX = pair[0];
      }

      if (result.smallestY > pair[1]) {
        result.smallestY = pair[1];
      }
    });
  });

  return result;
};
