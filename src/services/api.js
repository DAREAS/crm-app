import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Altere para o endereço do backend

const api = axios.create({
  baseURL: API_URL,
});

export default api; 