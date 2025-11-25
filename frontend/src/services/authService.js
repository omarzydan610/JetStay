import apiClient from "./axiosConfig";

class AuthService {
  async login(credentials) {
    try {

      const response = await apiClient.post('/api/auth/login', credentials);

      const token = response.data?.data;

      if (token) {
        this.setToken(token);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signup(userData) {
    try {
      const response = await apiClient.post('/api/auth/signup', userData);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Token management
  setToken(token) {
    localStorage.setItem('auth_token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  clearToken() {
    localStorage.removeItem('auth_token');
    delete apiClient.defaults.headers.common['Authorization'];
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          this.clearToken();
          return {
            message: data?.message || "Invalid credentials",
            status: 401,
            code: "UNAUTHORIZED"
          };

        case 403:
          this.clearToken();
          return {
            message: data?.message || "Access denied",
            status: 403,
            code: "FORBIDDEN"
          };

        default:
          return {
            message: data?.message || "Server error",
            status,
            code: "SERVER_ERROR"
          };
      }
    }

    if (error.request) {
      return {
        message: "Network error",
        code: "NETWORK_ERROR"
      };
    }

    return {
      message: error.message,
      code: "UNKNOWN_ERROR"
    };
  }
}

const authService = new AuthService();

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([401, 403].includes(error.response?.status)) {
      authService.clearToken();
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authService;
