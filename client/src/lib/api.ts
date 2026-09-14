import axios from "axios";

// Saat di Vercel, cukup pakai path relatif '/api/v1'.
// Saat dev di lokal, fallback ke 'http://localhost:5000/api/v1'.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api/v1" : "http://localhost:5000/api/v1");

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
