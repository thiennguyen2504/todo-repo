import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message;
    error.friendlyMessage = message || "Có lỗi xảy ra, vui lòng thử lại.";
    
    if (error.response?.data?.errors) {
      error.fieldErrors = error.response.data.errors;
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
