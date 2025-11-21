import apiClient from './axiosConfig';

class PasswordService {
  async sendOtpRequest(email) {
    const response = await apiClient.post('/api/auth/forgot-password', { email });
    return response.data;
  }

  async verifyOtpAndResetPassword(email, otp, newPassword) {
    // Mock success response
    console.log("holl");
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Password reset successfully" });
      }, 500);
    });
    // const response = await apiClient.post('/api/auth/verify-otp', { email, otp, newPassword });
    // return response.data;
  }
}

const passwordService = new PasswordService();
export default passwordService;
