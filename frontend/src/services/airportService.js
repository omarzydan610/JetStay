// frontend/src/services/airportService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api"; // adjust to your backend

export async function getCountries() {
  const res = await axios.get(`${API_URL}/countries`);
  return res.data; // e.g. [{code:"EG", name:"Egypt"}, ...]
}

export async function getCities(countryCode) {
  const res = await axios.get(`${API_URL}/countries/${countryCode}/cities`);
  return res.data; // e.g. [{id:1, name:"Cairo"}, ...]
}

export async function getAirports(cityId) {
  const res = await axios.get(`${API_URL}/cities/${cityId}/airports`);
  return res.data; // e.g. [{id:1, code:"CAI", name:"Cairo Intl"}, ...]
}
