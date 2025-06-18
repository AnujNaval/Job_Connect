import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // Change this as per your backend
  withCredentials: true,
});

export default API;
