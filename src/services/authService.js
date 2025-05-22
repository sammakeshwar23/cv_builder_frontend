import axios from 'axios';
import { API_BASE_URL } from '../constants/api'; 

export const loginUser = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
  return response.data;
};
