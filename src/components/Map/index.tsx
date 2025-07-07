"use client";
import { useRef } from "react";
import * as d3 from "d3";
import { MapCountry } from "@/types/maps";

interface Props {
  countries: MapCountry[];
}

export default function Map({ countries }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

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

        console.log("polygon[0]", polygon[0]);

        svg
          .append("path")
          .attr("d", lineFunc(polygon[0].map((point) => [point.x, point.y])))
          .attr("stroke", "black")
          .attr("stroke-width", 0.4)
          .attr("fill", "none");
      }
    }
  };

  return (
    <div>
      <button onClick={drawMap}>Draw Map</button>
      <div
        ref={mapRef}
        className="w-full h-full flex items-center justify-center"
      ></div>
    </div>
  );
}
