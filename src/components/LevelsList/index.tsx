"use client";

import { getLevels } from "@/lib/levels";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import _ from "lodash";
import Image from "next/image";
import { motion } from "motion/react";

export default function LevelsList() {
  const { data: levels } = useQuery({
    queryKey: ["levels"],
    queryFn: getLevels,
  });

  if (!levels) return;

  return (
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
  );
}
