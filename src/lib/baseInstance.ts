import axios from "axios";

export const BASE_URL = process.env.SERVER_URL;

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
