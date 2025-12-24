import apiClient from "../axiosConfig.js";
import authService from "../AuthServices/authService.js";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/admin/dashboard";

export const getHotelFlaggedReviews = async (page = 0, size = 10) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(
      `${API_URL}/hotel/flagged-reviews?page=${page}&size=${size}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch hotel flagged reviews");
    throw error;
  }
};

export const getAirlineFlaggedReviews = async (page = 0, size = 10) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(
      `${API_URL}/airline/flagged-reviews?page=${page}&size=${size}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch airline flagged reviews");
    throw error;
  }
};

export const deleteHotelFlaggedReview = async (reviewId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.delete(
      `${API_URL}/hotel/flagged-review/${reviewId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Hotel review deleted successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete hotel flagged review");
    throw error;
  }
};

export const deleteFlightFlaggedReview = async (reviewId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.delete(
      `${API_URL}/airline/flagged-review/${reviewId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Flight review deleted successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete flight flagged review");
    throw error;
  }
};

export const approveHotelFlaggedReview = async (reviewId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/hotel/flagged-review/${reviewId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Hotel review approved successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to approve hotel flagged review");
    throw error;
  }
};

export const approveFlightFlaggedReview = async (reviewId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/airline/flagged-review/${reviewId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Flight review approved successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to approve flight flagged review");
    throw error;
  }
};
