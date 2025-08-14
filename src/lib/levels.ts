import { CreateLevelParams, Level } from "@/types/api";
import { instance } from "./baseInstance";

export const getLevels = async (): Promise<Level[]> =>
  (await instance.get("/api/levels")).data;

export const getLevelById = async (id: string): Promise<Level> =>
  (await instance.get(`/api/levels/${id}`)).data[0];

export const createLevel = async (
  createLevelParams: CreateLevelParams
): Promise<Level> =>
  (await instance.post("/api/levels", createLevelParams)).data;
