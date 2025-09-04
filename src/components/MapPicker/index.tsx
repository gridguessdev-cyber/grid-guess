"use client";
import { maps } from "@/data/exports";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import _ from "lodash";
import { useStore } from "@/store/store";

interface Props {
  countriesList: string[];
  setSelectedCountry: Dispatch<SetStateAction<string>>;
}

export default function MapPicker({
  countriesList,
  setSelectedCountry,
}: Props) {
  const { map, setMap } = useStore((state) => state);

  const mapsList = Object.keys(maps).map(_.startCase);
  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target?.value);
  };

  const handleMapSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setMap(_.camelCase(event.target.value));
  };

  return (
    <div className="flex py-3 gap-15">
      <select
        name="maps"
        onChange={handleMapSelect}
        defaultValue={_.startCase(map)}
      >
        {mapsList.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <select name="countries" onChange={handleSelect}>
        {countriesList.map((country) => (
          <option key={country}>{country}</option>
        ))}
      </select>
    </div>
  );
}
