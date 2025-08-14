"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { MapCountry, Point, Polygon } from "@/types/maps";
import {
  calculatePolygonArea,
  getClickedSquareSides,
  getEdgePointsCoordinates,
  throttlify,
} from "@/utils";
import {
  checkIfPolygonsIntersect,
  findIntersectionBetweenPolygons,
} from "polygon-intersection";
import MapPicker from "../MapPicker";
import { debounce } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { createLevel } from "@/lib/levels";
import { useMapStore } from "@/providers/MapStoreProvider";

const additionalSquaresAmount = 10;

type RectSelection = d3.Selection<SVGRectElement, unknown, null, undefined>;
type SVGSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>;

type getOverlapParams = {
  squareTopCoordinates: number;
  squareLeftCoordinates: number;
};

type drawGridParams = {
  squareSize: number;
  horizontalShift?: number;
  verticalShift?: number;
  solutionSquare?: [number, number];
};

interface Props {
  mode: "guess" | "build";
  countriesToDisplay: MapCountry[];
  countriesForCalculations: MapCountry[];
}

export default function Map({
  mode,
  countriesToDisplay,
  countriesForCalculations,
}: Props) {
  const { mutateAsync: createLevelMutation } = useMutation({
    mutationFn: createLevel,
    onSuccess() {
      alert("level created");
    },
  });

  const { map } = useMapStore((state) => state);

  const mapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSelection>(null);

  const firstRender = useRef(true);

  const { edgeCoordinates, viewBoxSize } = useMemo(
    () => getEdgePointsCoordinates(countriesToDisplay),
    []
  );

  const longerSide = Math.max(viewBoxSize[0], viewBoxSize[1]);

  const defaultSquareSize = longerSide / 10;

  const countriesNames = useMemo(
    () => countriesForCalculations.map((country) => country.name).sort(),
    [countriesForCalculations]
  );

  const [selectedCountry, setSelectedCountry] = useState(countriesNames[0]);

  const [squareSize, setSquareSize] = useState(defaultSquareSize);
  const horizontalShift = useRef(0);
  const verticalShift = useRef(0);
  const solutionSquare = useRef<Point>([NaN, NaN]);

  const drawMap = () => {
    if (!mapRef.current) return;

    const countriesCoordinates = countriesToDisplay.map((feature) => {
      return feature.coordinates.map((polygon) => {
        return polygon.map((points) => {
          return points.map((point) => {
            return {
              x: point[0],
              y: point[1],
            };
          });
        });
      });
    });

    const svg = d3
      .select(mapRef.current)
      .append("svg")
      .classed("svg-content-responsive", true)
      .attr("width", "100%")
      .attr("height", "70vh")
      .attr("viewBox", `0 0 ${viewBoxSize[0]} ${viewBoxSize[1]}`);

    for (let i = 0; i < countriesCoordinates.length; i++) {
      for (let j = 0; j < countriesCoordinates[i].length; j++) {
        for (let k = 0; k < countriesCoordinates[i][j].length; k++) {
          const polygon = countriesCoordinates[i][j][k];
          const lineFunc = d3
            .line()
            .x(function (d) {
              return d[0];
            })
            .y(function (d) {
              return d[1];
            });

          svg
            .append("path")
            .attr("d", lineFunc(polygon.map((point) => [point.x, point.y])))
            .attr("stroke", "black")
            .attr("stroke-width", 0.2)
            .attr("fill", "none");
        }
      }
    }
  };

  const drawGrid = ({
    squareSize,
    horizontalShift = 0,
    verticalShift = 0,
  }: drawGridParams) => {
    if (!mapRef.current) return;
    removeGrid();

    const viewBoxSize = [
      edgeCoordinates.largestX - edgeCoordinates.smallestX,
      edgeCoordinates.largestY - edgeCoordinates.smallestY,
    ];

    const svg = d3
      .select(mapRef.current)
      .append("svg")
      .classed("svg-content-responsive", true)
      .attr("width", "100%")
      .attr("height", "70vh")
      .attr("viewBox", `0 0 ${viewBoxSize[0]} ${viewBoxSize[1]}`);

    gridRef.current = svg;
    const rectangles: RectSelection[][] = [];

    for (
      let x = horizontalShift - squareSize * additionalSquaresAmount;
      x < 360;
      x += squareSize
    ) {
      const row: RectSelection[] = [];
      for (
        let y = verticalShift - squareSize * additionalSquaresAmount;
        y < 180;
        y += squareSize
      ) {
        const rect = svg
          .append("rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", squareSize)
          .attr("height", squareSize)
          .attr("stroke", "black")
          .attr("stroke-width", 0.1)
          .attr(
            "fill",
            x === solutionSquare.current?.[0] &&
              y === solutionSquare.current?.[1]
              ? "#62a674"
              : "none"
          )
          .attr("fill-opacity", "0.2");
        row.push(rect);
      }

      rectangles.push(row);
    }

    svg.on("click", (event) => {
      const clickedSquareSides = getClickedSquareSides({
        squareSize,
        verticalShift,
        horizontalShift,
        clickCoordinates: d3.pointer(event),
      });

      getOverlap(clickedSquareSides);
    });

    const throttledMouseMove = throttlify((event) => {
      const [x, y] = d3.pointer(event);
      const gridX = Math.floor(
        (x - horizontalShift + squareSize * additionalSquaresAmount) /
          squareSize
      );
      const gridY = Math.floor(
        (y - verticalShift + squareSize * additionalSquaresAmount) / squareSize
      );

      const solutionSquareGridX =
        (solutionSquare.current?.[0] -
          horizontalShift +
          squareSize * additionalSquaresAmount) /
        squareSize;
      const solutionSquareGridY =
        (solutionSquare.current?.[1] -
          verticalShift +
          squareSize * additionalSquaresAmount) /
        squareSize;

      rectangles.forEach((row, rowIndex) => {
        row.forEach((rect, colIndex) => {
          if (rowIndex === gridX && colIndex === gridY) {
            rect.attr("fill", "#00080050");
          } else if (
            rowIndex === solutionSquareGridX &&
            colIndex === solutionSquareGridY
          ) {
            rect.attr("fill", "#62a674");
          } else {
            rect.attr("fill", "none");
          }
        });
      });
    });

    svg.on("mousemove", throttledMouseMove);
  };

  const removeGrid = () => {
    if (gridRef.current) {
      gridRef.current.remove();
      gridRef.current = null;
    }
  };

  const handleGridResize = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = +event.target.value;
    if (gridRef.current) {
      setSquareSize(newSize);
      findSquareWithMostCountryArea();
      horizontalShift.current = 0;
      verticalShift.current = 0;
      drawGrid({ squareSize: newSize });
    }
  };

  const handleGridHorizontalShift = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("grid horizontal shift");
    const newShift = +event.target.value;
    if (gridRef.current) {
      horizontalShift.current = newShift;
      findSquareWithMostCountryArea();
      drawGrid({
        squareSize,
        horizontalShift: horizontalShift.current,
        verticalShift: verticalShift.current,
      });
    }
  };

  const handleGridVerticalShift = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newShift = +event.target.value;
    if (gridRef.current) {
      verticalShift.current = newShift;
      findSquareWithMostCountryArea();
      drawGrid({
        squareSize,
        horizontalShift: horizontalShift.current,
        verticalShift: verticalShift.current,
      });
    }
  };

  const getOverlap = ({
    squareTopCoordinates,
    squareLeftCoordinates,
  }: getOverlapParams) => {
    const selectedCountryCoordinates = countriesForCalculations.filter(
      (country) => country.name === selectedCountry
    );

    const square: Polygon = [
      [squareLeftCoordinates, squareTopCoordinates],
      [squareLeftCoordinates + squareSize, squareTopCoordinates],
      [squareLeftCoordinates + squareSize, squareTopCoordinates + squareSize],
      [squareLeftCoordinates, squareTopCoordinates + squareSize],
    ];

    let intersections: Polygon[][] = [];

    selectedCountryCoordinates[0].coordinates.forEach((segment) => {
      const intersection = findIntersectionBetweenPolygons(square, segment[0]);
      if (intersection.length > 1) {
        intersections.push(...intersection.map((item) => [item]));
      } else {
        intersections.push(intersection);
      }
    });

    intersections = intersections.filter((segment) => segment[0]);

    if (!intersections[0]) return;

    const total = intersections.reduce((acc, segment) => {
      if (segment.length === 1) {
        console.log(segment);
        return (acc += calculatePolygonArea(segment));
      }

      return segment.reduce((acc, segment) => {
        return (acc += calculatePolygonArea([segment]));
      }, 0);
    }, 0);

    console.log("area", total);
  };

  const findSquareWithMostCountryArea = debounce(async () => {
    const selectedCountryCoordinates = countriesForCalculations.filter(
      (country) => country.name === selectedCountry
    )[0];

    const intersectedSquares = [];

    let squareWithMostCountryArea: Polygon = [];
    let biggestArea = 0;
    for (
      let x = horizontalShift.current - squareSize * additionalSquaresAmount;
      x < 360;
      x += squareSize
    ) {
      for (
        let y = verticalShift.current - squareSize * additionalSquaresAmount;
        y < 180;
        y += squareSize
      ) {
        const square: Polygon = [
          [x, y],
          [x + squareSize, y],
          [x + squareSize, y + squareSize],
          [x, y + squareSize],
        ];

        const squaresToCheck: Polygon[] = [];

        selectedCountryCoordinates.coordinates.forEach((segment) => {
          if (checkIfPolygonsIntersect(square, segment[0])) {
            squaresToCheck.push(square);
          }
        });

        intersectedSquares.push(...squaresToCheck);
      }
    }

    const unique = Array.from(
      new Set(intersectedSquares.map((arr) => JSON.stringify(arr)))
    ).map((str) => JSON.parse(str));

    unique.forEach((square) => {
      let intersections: Polygon[][] = [];

      selectedCountryCoordinates.coordinates.forEach((segment) => {
        const intersection = findIntersectionBetweenPolygons(
          square,
          segment[0]
        );
        if (intersection.length > 1) {
          intersections.push(...intersection.map((item) => [item]));
        } else {
          intersections.push(intersection);
        }
      });

      intersections = intersections.filter((item) => item[0]);

      const totalArea = intersections.reduce((acc, segment) => {
        if (segment.length === 1) {
          return (acc += calculatePolygonArea(segment));
        }

        return segment.reduce((acc, segment) => {
          return (acc += calculatePolygonArea([segment]));
        }, 0);
      }, 0);

      if (totalArea > biggestArea) {
        squareWithMostCountryArea = square;
        biggestArea = totalArea;
      }
    });

    solutionSquare.current = squareWithMostCountryArea[0];
    drawGrid({
      squareSize,
      horizontalShift: horizontalShift.current,
      verticalShift: verticalShift.current,
    });

    return squareWithMostCountryArea;
  }, 600);

  useEffect(() => {
    drawMap();
    drawGrid({
      squareSize: defaultSquareSize,
    });
    return () => {
      gridRef.current?.on("click", null).on("mousemove", null);
    };
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      findSquareWithMostCountryArea();
      drawGrid({
        squareSize,
        horizontalShift: horizontalShift.current,
        verticalShift: verticalShift.current,
      });
    }
    firstRender.current = false;
  }, [selectedCountry, squareSize]);

  const min = Math.ceil(defaultSquareSize - 0.03 * longerSide);
  const max = Math.ceil(defaultSquareSize + 0.03 * longerSide);

  const shiftGridBoundaries = Math.round(squareSize * 10) / 10;

  return (
    <div>
      {mode === "build" && (
        <div className="flex flex-col items-center mb-4">
          <div className="flex flex-col gap-5 w-[80%]">
            <MapPicker
              countriesList={countriesNames}
              setSelectedCountry={setSelectedCountry}
            />
            <input
              type="range"
              min={min}
              max={max}
              step={0.1}
              onChange={handleGridResize}
            />
            <input
              type="range"
              min={-shiftGridBoundaries}
              max={shiftGridBoundaries}
              step={0.1}
              onChange={handleGridHorizontalShift}
            />
          </div>
        </div>
      )}
      <div>
        <div ref={mapRef} />
      </div>
      {mode === "build" && (
        <div className="h-[70vh] w-20 flex justify-center items-center">
          <div className="rotate-90">
            <input
              type="range"
              min={-shiftGridBoundaries}
              max={shiftGridBoundaries}
              step={0.1}
              onChange={handleGridVerticalShift}
              className="w-[70vh]"
            />
          </div>
        </div>
      )}
      {mode === "build" && (
        <div className="mx-[10%] my-3 flex justify-end">
          <button
            className="cursor-pointer"
            onClick={() =>
              createLevelMutation({
                map,
                country: selectedCountry,
                squareSize,
                horizontalShift: horizontalShift.current,
                verticalShift: verticalShift.current,
              })
            }
          >
            Create Level
          </button>
        </div>
      )}
    </div>
  );
}
