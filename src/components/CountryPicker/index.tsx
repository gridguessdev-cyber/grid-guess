"use client";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Props {
  countriesList: string[];
  setSelectedCountry: Dispatch<SetStateAction<string>>;
}

export default function CountryPicker({
  countriesList,
  setSelectedCountry,
}: Props) {
  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target?.value);
  };

  return (
    <select name="countries" onChange={handleSelect}>
      {countriesList.map((country) => (
        <option key={country}>{country}</option>
      ))}
    </select>
  );
}
