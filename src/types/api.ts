export type Level = {
  id: string;
  map: string;
  country: string;
  squareSize: number;
  horizontalShift: number;
  verticalShift: number;
};

export type CreateLevelParams = Omit<Level, "id">;
