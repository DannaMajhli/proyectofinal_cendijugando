// services/api.js
// Configuración central de axios — cubre: consumo de APIs, interceptores, tokens

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor de REQUEST: adjunta el token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de RESPONSE: maneja errores 401 globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ── Servicios de Auth ──
export const authService = {
  login: (datos) => api.post('/auth/login', datos),
  registro: (datos) => api.post('/auth/registro', datos),
  perfil: () => api.get('/auth/perfil'),
}

// ── Servicios de Alumnos ──
export const alumnosService = {
  listar: (params) => api.get('/alumnos', { params }),
  obtener: (id) => api.get(`/alumnos/${id}`),
  crear: (datos) => api.post('/alumnos', datos),
  actualizar: (id, datos) => api.put(`/alumnos/${id}`, datos),
  eliminar: (id) => api.delete(`/alumnos/${id}`),
}

// ── Servicios de Pagos ──
export const pagosService = {
  listar: (params) => api.get('/pagos', { params }),
  listarPorAlumno: (alumnoId) => api.get(`/pagos/alumno/${alumnoId}`),
  registrar: (datos) => api.post('/pagos', datos),
  eliminar: (id) => api.delete(`/pagos/${id}`),
}

// ── Servicios de Avisos ──
export const avisosService = {
  listar: () => api.get('/avisos'),
  listarPublicos: () => api.get('/avisos/publicos'),
  crear: (datos) => api.post('/avisos', datos),
  actualizar: (id, datos) => api.put(`/avisos/${id}`, datos),
  eliminar: (id) => api.delete(`/avisos/${id}`),
}

// ── Servicios de Grupos ──
export const gruposService = {
  listar: () => api.get('/grupos'),
  crear: (datos) => api.post('/grupos', datos),
  actualizar: (id, datos) => api.put(`/grupos/${id}`, datos),
  eliminar: (id) => api.delete(`/grupos/${id}`),
}
