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

const defaultSquareSize = 10;
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
  countriesToDisplay: MapCountry[];
  countriesForCalculations: MapCountry[];
}

export default function Map({
  countriesToDisplay,
  countriesForCalculations,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSelection>(null);

  const firstRender = useRef(true);

  const edgeCoordinates = useMemo(
    () => getEdgePointsCoordinates(countriesToDisplay),
    []
  );

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
    const newSize = parseInt(event.target.value, 10);
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
    const newShift = parseInt(event.target.value);
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
    const newShift = parseInt(event.target.value);
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

  return (
    <div>
      <div className="flex flex-col items-center mb-4">
        <div className="flex flex-col gap-5 w-[80%]">
          <MapPicker
            countriesList={countriesNames}
            setSelectedCountry={setSelectedCountry}
          />
          <input type="range" min={5} max={15} onChange={handleGridResize} />
          <input
            type="range"
            min={-squareSize}
            max={squareSize}
            onChange={handleGridHorizontalShift}
          />
        </div>
      </div>
      <div>
        <div ref={mapRef} />
      </div>
      <div className="h-[70vh] w-20 flex justify-center items-center">
        <div className="rotate-90">
          <input
            type="range"
            min={-squareSize}
            max={squareSize}
            onChange={handleGridVerticalShift}
            className="w-[70vh]"
          />
        </div>
      </div>
    </div>
  );
}
