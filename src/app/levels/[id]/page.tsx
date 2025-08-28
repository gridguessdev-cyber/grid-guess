import Map from "@/components/Map";
import { maps } from "@/data/exports";
import { getLevelById } from "@/lib/levels";
import _ from "lodash";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Level({ params }: Props) {
  const { id } = await params;

  const level = await getLevelById(id);

  return (
    <div>
      <p className="text-center my-8">
        Your goal is to find square containing the most area of{" "}
        <b>{_.capitalize(level.country)}</b>
      </p>
      <Map
        mode="guess"
        countriesToDisplay={maps[_.camelCase(level.map)].display}
        countriesForCalculations={maps[_.camelCase(level.map)].calculations}
        displayIndividualCountries={
          maps[_.camelCase(level.map)].displayIndividualCountries
        }
        level={level}
      />
    </div>
  );
}
