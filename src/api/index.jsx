// src/api/index.js
import axios from 'axios';

const API_BASE_URL = 'http://52.66.183.84:8088';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (mobileNo, password) => {
  try {
    const response = await api.post('/login', { mobileNo, password });
    return response.data; // Should contain message, statusCode, and data (if any)
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getOrderHistory = async (startDate, endDate, locationFrom = '', locationTo = '') => {
  try {
    const response = await api.post('/orderHistoryFiltered', {
      startDate,
      endDate,
      locationFrom,
      locationTo,
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;