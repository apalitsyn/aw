import axios from 'axios';

const prod = process.env.REACT_APP_PROD ? true : false;

const api = axios.create({
  baseURL: prod ? '' : 'http://localhost:8833',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;