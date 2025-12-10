import apiClient from "../axiosConfig.js";
import authService from "../AuthServices/authService.js";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/admin/dashboard";

export const getUsersByFilter = async (data) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.post(
      `${API_URL}/users`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch Users by filter");
    throw error;
  }
};

export const getAirlinesByFilter = async (data) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.post(
      `${API_URL}/airlines`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch Airlines by filter");
    throw error;
  }
};

export const getHotelsByFilter = async (data) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.post(
      `${API_URL}/hotels`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch Hotels by filter");
    throw error;
  }
};

export const getAirlineAdmin = async (id) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(`${API_URL}/airline-admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch Airline Admin details");
    throw error;
  }
};

export const getHotelAdmin = async (id) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(`${API_URL}/hotel-admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch Hotel Admin details");
    throw error;
  }
};