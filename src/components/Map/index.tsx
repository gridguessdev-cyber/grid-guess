"use client";
import { useRef, useState } from "react";
import * as d3 from "d3";
import { MapCountry } from "@/types/maps";
import { throttlify } from "@/utils";

type RectSelection = d3.Selection<SVGRectElement, unknown, null, undefined>;
type SVGSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>;

type drawGridParams = {
  squareSize: number;
  horizontalShift?: number;
  verticalShift?: number;
};

interface Props {
  countries: MapCountry[];
}

export default function Map({ countries }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSelection>(null);

  const [squareSize, setSquareSize] = useState(15);
  const horizontalShift = useRef(0);
  const verticalShift = useRef(0);

  const drawMap = () => {
    if (!mapRef.current) return;

    const countriesCoordinates = countries.map((feature) => {
      return feature.coordinates.map((polygon) => {
        return polygon.map((points) => {
          return points.map((point) => {
            return {
              x: point[0] + 180,
              y: -(point[1] - 90),
            };
          });
        });
      });
    });

    const svg = d3
      .select(mapRef.current)
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 360 180")
      .classed("svg-content-responsive", true);

    for (let i = 0; i < countriesCoordinates.length; i++) {
      for (let j = 0; j < countriesCoordinates[i].length; j++) {
        const polygon = countriesCoordinates[i][j];
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
          .attr("d", lineFunc(polygon[0].map((point) => [point.x, point.y])))
          .attr("stroke", "black")
          .attr("stroke-width", 0.4)
          .attr("fill", "none");
      }
    }
  };

  const drawGrid = ({
    squareSize,
    horizontalShift = 0,
    verticalShift = 0,
  }: drawGridParams) => {
    if (!mapRef.current) return;
    const svg = d3
      .select(mapRef.current)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 360 180")
      .classed("svg-content-responsive", true)
      .style("width", "95%")
      .style("left", "2.5%");

    gridRef.current = svg;
    const rectangles: RectSelection[][] = [];

    for (let x = horizontalShift - squareSize * 3; x < 360; x += squareSize) {
      const row: RectSelection[] = [];
      for (let y = verticalShift - squareSize * 3; y < 180; y += squareSize) {
        const rect = svg
          .append("rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", squareSize)
          .attr("height", squareSize)
          .attr("stroke", "black")
          .attr("stroke-width", 0.1)
          .attr("fill", "none");
        row.push(rect);
      }

      rectangles.push(row);
    }

    svg.on("click", (event) => {
      console.log("SVG clicked", d3.pointer(event));
    });

    const throttledMouseMove = throttlify((event) => {
      const [x, y] = d3.pointer(event);
      const gridX = Math.floor(
        (x - horizontalShift + squareSize * 3) / squareSize
      );
      const gridY = Math.floor(
        (y - verticalShift + squareSize * 3) / squareSize
      );

      rectangles.forEach((row, rowIndex) => {
        row.forEach((rect, colIndex) => {
          if (rowIndex === gridX && colIndex === gridY) {
            rect.attr("fill", "#00080050");
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
      removeGrid();
      setSquareSize(newSize);
      horizontalShift.current = 0;
      verticalShift.current = 0;
      drawGrid({ squareSize: newSize });
    }
  };

  const handleGridHorizontalShift = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newShift = parseInt(event.target.value, 10);
    if (gridRef.current) {
      removeGrid();
      horizontalShift.current = newShift;
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
    const newShift = parseInt(event.target.value, 10);
    if (gridRef.current) {
      removeGrid();
      verticalShift.current = newShift;
      drawGrid({
        squareSize,
        horizontalShift: horizontalShift.current,
        verticalShift: verticalShift.current,
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center mb-4">
        <div className="flex gap-3 mb-4">
          <button onClick={drawMap}>Draw Map</button>
          <button
            onClick={() =>
              drawGrid({
                squareSize: 15,
              })
            }
          >
            Draw Grid
          </button>
          <button onClick={removeGrid}>Remove Grid</button>
        </div>
        <div>
          <input type="range" min={10} max={30} onChange={handleGridResize} />
          <input
            type="range"
            min={-squareSize}
            max={squareSize}
            onChange={handleGridHorizontalShift}
          />
          <input
            type="range"
            min={-squareSize}
            max={squareSize}
            onChange={handleGridVerticalShift}
          />
        </div>
      </div>
      <div
        ref={mapRef}
        className="w-full h-full flex items-center justify-center"
      />
    </div>
  );
}
