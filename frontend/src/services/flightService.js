import apiClient from "./axiosConfig.js";
import authService from "./AuthServices/authService.js";

const API_URL = "http://localhost:8080/api/flight/";

export const getFlights = async (page = 0, size = 10) => {
  const token = authService.getToken();
  const res = await apiClient.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, size }
  });
  console.log("Fetched flights:", res.data);
  return res.data;
};


export const createFlight = async (flightData) => {
  const token = authService.getToken();
  const res = await apiClient.post(`${API_URL}add`, flightData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Created flight:", res.data);
  return res.data;
};

export const updateFlight = async (id, flightData) => {
  console.log("Updating flight ID:", id, "with data:", flightData);
  const token = authService.getToken();
  const res = await apiClient.patch(`${API_URL}update/${id}`, flightData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Updated flight:", res.data);
  return res.data;
};

export const deleteFlight = async (id) => {
  const token = authService.getToken();
  const res = await apiClient.delete(`${API_URL}delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

