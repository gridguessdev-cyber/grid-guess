"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import _ from "lodash";
import Image from "next/image";
import { motion } from "motion/react";
import { useServices } from "@/providers/ServicesProvider";
import { maps } from "@/data/exports";
import { useState } from "react";

export default function LevelsList() {
  const [selectedFilterCountry, setSelectedFilterCountry] =
    useState<string>("All");
  const { levelsService } = useServices();

  const { data: levels, isLoading } = useQuery({
    queryKey: ["levels", selectedFilterCountry],
    queryFn: () => levelsService.getLevels({ map: selectedFilterCountry }),
  });

  const mapsList = Object.keys(maps).map(_.startCase);
  mapsList.unshift("All");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <span>Filter by region: </span>
        <select
          value={selectedFilterCountry}
          onChange={(event) => {
            setSelectedFilterCountry(event.target.value);
          }}
        >
          {mapsList.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {!isLoading && !levels?.length && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mt-3 font-semibold"
        >
          No levels found for the selected region.
        </motion.div>
      )}
      {!!levels?.length && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {levels.map((level) => (
              <Link key={level.id} href={`/levels/${level.id}`}>
                <div className="rounded-xl p-4 flex justify-between items-center bg-white">
                  <div className="alfa-slab-one-regular">{level.country}</div>
                  <div className="flex gap-2 items-center">
                    <Image
                      src={"/icons/world-map.svg"}
                      alt="map icon"
                      width={30}
                      height={30}
                    />
                    <div className="font-bold">{_.capitalize(level.map)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
