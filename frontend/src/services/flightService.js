import apiClient from "./axiosConfig.js";
import authService from "./AuthServices/authService.js";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/flight";

export const getFlights = async (page = 0, size = 10) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size },
    });
    console.log("Fetched flights:", res.data);
    return res.data;
  } catch (error) {
    toast.error("Failed to load flights");
    throw error;
  }
};

export const createFlight = async (flightData) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.post(`${API_URL}/add`, flightData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Flight created successfully!");
    return res.data;
  } catch (error) {
    toast.error("Failed to create flight");
    throw error;
  }
};

export const updateFlight = async (id, flightData) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.patch(`${API_URL}/update/${id}`, flightData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Flight updated successfully!");
    return res.data;
  } catch (error) {
    toast.error("Failed to update flight");
    throw error;
  }
};

export const deleteFlight = async (id) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.delete(`${API_URL}/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Flight deleted successfully!");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete flight");
    throw error;
  }
};

export async function getCountries() {
  const token = authService.getToken();
  const res = await apiClient.get(`${API_URL}/countries`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Fetched countries:", res.data);
  return res.data;
}

/**
 * Backend endpoint:
 * GET /api/flight/cities?country=Australia
 */
export async function getCities(countryName) {
  const token = authService.getToken();
  const res = await apiClient.get(`${API_URL}/cities`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { country: countryName },
  });

  console.log("Fetched cities:", res.data);
  return res.data;
}

/**
 * Backend endpoint:
 * GET /api/flight/airPorts?country=Australia&city=Sydney
 */
export async function getAirports(countryName, cityName) {
  const token = authService.getToken();
  const res = await apiClient.get(`${API_URL}/airPorts`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { country: countryName, city: cityName },
  });

  console.log("Fetched airports:", res.data);
  return res.data;
}

/**
 * Backend endpoint:
 * GET /api/flight/ticket-types
 */
export async function getTicketTypes() {
  const token = authService.getToken();
  const res = await apiClient.get(`${API_URL}/ticket-types`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Fetched ticket types:", res.data);
  return res.data;
}

export const getFlightDetails = async (id) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(`${API_URL}details/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch flight details");
    throw error;
  }
};
