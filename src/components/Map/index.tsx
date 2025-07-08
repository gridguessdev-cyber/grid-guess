"use client";
import { useRef } from "react";
import * as d3 from "d3";
import { MapCountry } from "@/types/maps";
import { throttlify } from "@/utils";

type RectSelection = d3.Selection<SVGRectElement, unknown, null, undefined>;

interface Props {
  countries: MapCountry[];
}

export default function Map({ countries }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const squareSize = 15;

  const drawMap = () => {
    if (!mapRef.current) return;

    const europeCoordinates = countries.map((feature) => {
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

    for (let i = 0; i < europeCoordinates.length; i++) {
      for (let j = 0; j < europeCoordinates[i].length; j++) {
        const polygon = europeCoordinates[i][j];
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

  const drawGrid = () => {
    if (!mapRef.current) return;
    const svg = d3
      .select(mapRef.current)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 360 180")
      .classed("svg-content-responsive", true)
      .style("width", "95%")
      .style("left", "2.5%");

    const rectangles: RectSelection[][] = [];

    for (let x = 0; x < 360; x += squareSize) {
      const row: RectSelection[] = [];
      for (let y = 0; y < 180; y += squareSize) {
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
      const gridX = Math.floor(x / squareSize);
      const gridY = Math.floor(y / squareSize);

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

  return (
    <div>
      <button onClick={drawMap}>Draw Map</button>
      <button onClick={drawGrid}>Draw Grid</button>
      <div
        ref={mapRef}
        className="w-full h-full flex items-center justify-center"
      ></div>
    </div>
  );
}
