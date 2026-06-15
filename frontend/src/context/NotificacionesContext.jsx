// context/NotificacionesContext.jsx
// Maneja los avisos no leídos con localStorage para persistencia

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { avisosService } from '../services/api'
import { useAuth } from './AuthContext'

const NotificacionesContext = createContext(null)

export function NotificacionesProvider({ children }) {
  const { usuario } = useAuth()
  const [avisosNoLeidos, setAvisosNoLeidos] = useState(0)
  const [avisosRecientes, setAvisosRecientes] = useState([])

  // Obtener IDs leídos del localStorage
  const obtenerLeidos = useCallback(() => {
    const leidos = localStorage.getItem(`avisos_leidos_${usuario?.id}`)
    return leidos ? JSON.parse(leidos) : []
  }, [usuario?.id])

  // Cargar avisos y calcular no leídos
  const cargarNotificaciones = useCallback(async () => {
    if (!usuario) return
    try {
      const res = await avisosService.listar()
      const avisos = res.data || []
      const leidos = obtenerLeidos()
      const noLeidos = avisos.filter(a => !leidos.includes(a.id))
      setAvisosNoLeidos(noLeidos.length)
      setAvisosRecientes(avisos.slice(0, 5))
    } catch { }
  }, [usuario, obtenerLeidos])

  // Cargar al montar y cuando cambia el usuario
  useEffect(() => {
    cargarNotificaciones()
  }, [cargarNotificaciones])

  // Marcar todos como leídos
  const marcarTodosLeidos = useCallback(() => {
    const ids = avisosRecientes.map(a => a.id)
    localStorage.setItem(`avisos_leidos_${usuario?.id}`, JSON.stringify(ids))
    setAvisosNoLeidos(0)
  }, [avisosRecientes, usuario?.id])

  return (
    <NotificacionesContext.Provider value={{
      avisosNoLeidos,
      avisosRecientes,
      cargarNotificaciones,
      marcarTodosLeidos,
    }}>
      {children}
    </NotificacionesContext.Provider>
  )
}

export function useNotificaciones() {
  const ctx = useContext(NotificacionesContext)
  if (!ctx) throw new Error('useNotificaciones debe usarse dentro de NotificacionesProvider')
  return ctx
}
