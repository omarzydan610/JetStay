import apiClient from "./axiosConfig.js";
import authService from "./AuthServices/authService.js";

const API_URL = "/api/airline/flights";

export const getFlights = async () => {
  const token = authService.getToken();
  const res = await apiClient.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createFlight = async (flightData) => {
  const token = authService.getToken();
  const res = await apiClient.post(API_URL, flightData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateFlight = async (id, flightData) => {
  const token = authService.getToken();
  const res = await apiClient.put(`${API_URL}/${id}`, flightData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteFlight = async (id) => {
  const token = authService.getToken();
  const res = await apiClient.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
