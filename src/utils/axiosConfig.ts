import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://26.179.150.24:8000',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('響應錯誤:', error.response.data);
    } else if (error.request) {
      console.error('請求錯誤:', error.request);
    } else {
      console.error('設置錯誤:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
