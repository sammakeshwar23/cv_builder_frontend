import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const PAYMENT_API = `${API_BASE_URL}/payment`;

export const createPaymentOrder = async (amount) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${PAYMENT_API}/create-order`,
    { amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
