// frontend/src/services/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000', // sesuaikan dengan backend-mu
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
