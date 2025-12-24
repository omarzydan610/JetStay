import apiClient from "../axiosConfig.js";
import authService from "../AuthServices/authService.js";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api/hotel/reviews";

export const addHotelReview = async (reviewData) => {
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
    toast.error("Failed to add hotel review");
    throw error;
  }
};

export const editHotelReview = async (reviewData) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.put(
      `${API_URL}/edit`,
      reviewData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Hotel review updated successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to edit hotel review");
    throw error;
  }
};

export const deleteHotelReview = async (bookingTransactionId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.delete(
      `${API_URL}/delete/${bookingTransactionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Hotel review deleted successfully");
    return res.data;
  } catch (error) {
    toast.error("Failed to delete hotel review");
    throw error;
  }
};

export const getHotelReviews = async (hotelId, page = 0, size = 10) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(
      `${API_URL}/${hotelId}?page=${page}&size=${size}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch hotel reviews");
    throw error;
  }
};

export const getHotelReviewSummary = async (hotelId) => {
  try {
    const token = authService.getToken();
    const res = await apiClient.get(
      `${API_URL}/${hotelId}/summary`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to fetch hotel review summary");
    throw error;
  }
};