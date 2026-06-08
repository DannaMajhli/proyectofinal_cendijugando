// context/AuthContext.jsx
// Estado global con Context API — cubre: manejo de estado global en React

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true) // useEffect de montaje

  // useEffect — montaje: verifica si ya hay sesión activa al cargar la app
  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem('token')
      const userGuardado = localStorage.getItem('user')
      if (token && userGuardado) {
        try {
          await authService.perfil() // valida el token con el backend
          setUsuario(JSON.parse(userGuardado))
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setCargando(false)
    }
    verificarSesion()
  }, []) // [] = solo en montaje

  const login = useCallback(async (correo, contrasena) => {
    const res = await authService.login({ correo, contrasena })
    const { token, usuario: user } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUsuario(user)
    return user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUsuario(null)
  }, [])

  const registro = useCallback(async (datos) => {
    const res = await authService.registro(datos)
    return res.data
  }, [])

  const esAdmin = usuario?.rol === 'admin'
  const esPadre = usuario?.rol === 'padre'

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout, registro, esAdmin, esPadre }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para consumir el contexto
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
