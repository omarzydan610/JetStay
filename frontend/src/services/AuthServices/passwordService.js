import apiClient from "../axiosConfigaxiosConfig";

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

  async changePasswordWithToken(email, newPassword, resetToken) {
    const response = await apiClient.post(
      "/api/auth/change-password",
      { email, newPassword },
      { headers: { "Reset-Token": resetToken } }
    );
    return response.data;
  }
}

const passwordService = new PasswordService();
export default passwordService;
