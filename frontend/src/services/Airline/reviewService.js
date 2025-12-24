import apiClient from "../axiosConfig.js";
import authService from "../AuthServices/authService.js";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/airline/reviews";

export const addAirlineReview = async (reviewData) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.post(
      `${API_URL}/add`,
      reviewData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Review added successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to add review");
    throw error;
  }
};

export const editAirlineReview = async (reviewData) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/edit`,
      reviewData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Review updated successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to edit review");
    throw error;
  }
};

export const deleteAirlineReview = async (ticketId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.delete(
      `${API_URL}/delete/${ticketId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Review deleted successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete review");
    throw error;
  }
};

export const getAirlineReviews = async (airlineId, page = 0, size = 10) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(
      `${API_URL}/${airlineId}?page=${page}&size=${size}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch airline reviews");
    throw error;
  }
};

export const getAirlineReviewSummary = async (airlineId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(
      `${API_URL}/${airlineId}/summary`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch airline review summary");
    throw error;
  }
};