// frontend/src/services/airportService.js
import axios from "axios";
import authService from "./AuthServices/authService.js";

const API_URL = "http://localhost:8080/api/airline";

export async function getCountries() {
  const token = authService.getToken();
  const res = await axios.get(`${API_URL}/countries`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Fetched countries:", res.data);
  return res.data;
}

/**
 * Backend endpoint:
 * GET /api/airline/cities?country=Australia
 */
export async function getCities(countryName) {
  const token = authService.getToken();
  const res = await axios.get(`${API_URL}/cities`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { country: countryName },
  });

  console.log("Fetched cities:", res.data);
  return res.data;
}

/**
 * Backend endpoint:
 * GET /api/airline/airPorts?country=Australia&city=Sydney
 */
export async function getAirports(countryName, cityName) {
  const token = authService.getToken();
  const res = await axios.get(`${API_URL}/airPorts`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { country: countryName, city: cityName },
  });

  console.log("Fetched airports:", res.data);
  return res.data;
}
