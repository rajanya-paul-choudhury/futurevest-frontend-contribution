import axios from './axiosInstance';

// Wrapper for fetch with authentication
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Wrapper for axios with authentication
export const authAxios = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
});

// Add request interceptor to add auth token
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); 