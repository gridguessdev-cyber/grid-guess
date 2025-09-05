export type Level = {
  id: string;
  map: string;
  country: string;
  squareSize: number;
  horizontalShift: number;
  verticalShift: number;
  author: string;
};

export type CreateLevelParams = Omit<Level, "id">;
