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

export type UserProfile = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
};
