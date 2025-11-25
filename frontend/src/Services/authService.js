import http from './http';

class AuthService {
  async login(credentials) {
    try {
      const response = await http.post('/login', credentials);
      
      // Store token upon successful login
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async signup(userData) {
    try {
      const response = await http.post('/signup', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Token management methods
  setToken(token) {
    localStorage.setItem('auth_token', token);
    // Update axios default headers
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Helper method to check token expiration (you might want to use a JWT library)
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
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Missing or invalid token
          this.clearToken();
          return {
            message: data?.message || 'Authentication required. Please log in.',
            status: 401,
            code: 'UNAUTHORIZED'
          };
          
        case 403:
          // Forbidden - Blocked user or insufficient permissions
          this.clearToken();
          return {
            message: data?.message || 'Access denied. Your account may be blocked.',
            status: 403,
            code: 'FORBIDDEN'
          };
          
        default:
          return {
            message: data?.message || 'An error occurred',
            status: status,
            code: 'SERVER_ERROR'
          };
      }
    } else if (error.request) {
      // Request made but no response received
      return {
        message: 'Network error. Please check your connection.',
        status: null,
        code: 'NETWORK_ERROR'
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: null,
        code: 'UNKNOWN_ERROR'
      };
    }
  }
}

// Create singleton instance
const authService = new AuthService();

// Setup axios interceptor to handle auth errors globally
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear token and redirect to login on auth errors
      authService.clearToken();
      // You can add redirect logic here if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// Request interceptor
http.interceptors.request.use(
  (config) => {
    // You can add auth tokens here later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set initial token if exists
const token = authService.getToken();
if (token) {
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default authService;