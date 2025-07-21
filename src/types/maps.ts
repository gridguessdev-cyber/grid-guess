export type CountriesCollection = {
  type: string;
  features: {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: Record<string, any>;
    geometry: {
      //   type: "Polygon" | "MultiPolygon";
      type: string;
      coordinates: [number, number][][] | [number, number][][][];
    };
  }[];
};

export type MapCountry = {
  name: string;
  id: string;
  coordinates: [number, number][][][];
};

export type Polygon = [number, number];
