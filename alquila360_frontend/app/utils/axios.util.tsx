// app/utils/axios.util.tsx

import axios from "axios";

export const instance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json', // Es buena práctica definir el tipo de contenido JSON
    mode: 'cors'
  }
});

// Interceptor para inyectar el token de autorización
instance.interceptors.request.use(
  (config) => {
    // 1. Obtener el token (ajusta la forma de obtenerlo según tu proyecto)
    const token = localStorage.getItem('authToken'); // O usa una cookie

    // 2. Si el token existe, adjuntarlo al encabezado
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
