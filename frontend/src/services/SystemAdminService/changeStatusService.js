import apiClient from "../axiosConfig.js";
import authService from "../AuthServices/authService.js";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/admin/status";

export const activateUser = async (email) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/user/activate`,
      null,
      { 
        headers: { Authorization: `Bearer ${token}` },
        params: { email }
      }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to Activate User");
    throw error;
  }
};

export const deactivateUser = async (email, reason) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/user/deactivate`,
      null,
      { 
        headers: { Authorization: `Bearer ${token}` },
        params: { email, reason }
      }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to Deactivate User");
    throw error;
  }
};

export const activateAirline = async (airlineID) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/airline/activate`,
      null,
      { 
        headers: { Authorization: `Bearer ${token}` },
        params: { airlineID }
      }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to Activate Airline");
    throw error;
  }
};

export const deactivateAirline = async (airlineID, reason) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/airline/deactivate`,
      null,
      { 
        headers: { Authorization: `Bearer ${token}` },
        params: { airlineID, reason }
      }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to Deactivate Airline");
    throw error;
  }
};

export const activateHotel = async (hotelID) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/hotel/activate`,
      null,
      { 
        headers: { Authorization: `Bearer ${token}` },
        params: { hotelID }
      }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to Activate Hotel");
    throw error;
  }
};

export const deactivateHotel = async (hotelID, reason) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/hotel/deactivate`,
      null,
      { 
        headers: { Authorization: `Bearer ${token}` },
        params: { hotelID, reason }
      }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to Deactivate Hotel");
    throw error;
  }
};