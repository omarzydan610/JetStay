import apiClient from "../axiosConfig";
import authService from "../AuthServices/authService";

/**
 * @param {Object} userData - (firstName, lastName, phoneNumber, etc.)
 */
export const updateUserInfo = async (userData) => {
  try {
    const token = authService.getToken();
    
    const response = await apiClient.patch("/api/user/update-info", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};
