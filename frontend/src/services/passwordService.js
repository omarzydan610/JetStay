import apiClient from './axiosConfig';

class PasswordService {
  async sendOtpRequest(email) {
    const response = await apiClient.post('/api/auth/forgot-password', { email });
    return response.data;
  }

  async verifyOtpAndResetPassword(email, otp, newPassword) {
    const response = await apiClient.post('/api/auth/change-password-with-otp', { email, otp, newPassword });
    return response.data;
  }
}

const passwordService = new PasswordService();
export default passwordService;
