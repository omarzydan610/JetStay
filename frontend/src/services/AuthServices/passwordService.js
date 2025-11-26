import apiClient from "../axiosConfig";

class PasswordService {
  async sendOtpRequest(email) {
    const response = await apiClient.post("/api/auth/forgot-password", {
      email,
    });
    return response.data;
  }

  async verifyOtp(email, otp) {
    const response = await apiClient.post("/api/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  }

  async resetPassword(email, resetToken, newPassword) {
    const response = await apiClient.post(
      "/api/auth/reset-password",
      { email, newPassword },
      { headers: { "Reset-Token": resetToken } }
    );
    return response.data;
  }
}

const passwordService = new PasswordService();
export default passwordService;
