import apiClient from "./axiosConfig";
// Base URL for your backend
const API_URL = "/api/airline/flights";

export const getFlights = async (page = 0, size = 5) => {
  return await apiClient.get(`${API_URL}?page=${page}&size=${size}`);
};

export const createFlight = async (flight) => {
  return await apiClient.post(API_URL, flight);
};

export const updateFlight = async (id, flight) => {
  return await apiClient.put(`${API_URL}/${id}`, flight);
};

export const deleteFlight = async (id) => {
  return await apiClient.delete(`${API_URL}/${id}`);
};
