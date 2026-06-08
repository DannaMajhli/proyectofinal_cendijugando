// hooks/index.js
// Todos los hooks personalizados en un solo archivo sin imports duplicados

import { useState, useEffect, useCallback, useRef } from 'react'
import { alumnosService } from '../services/api'

// ── Hook 1: useAlumnos ──
// Maneja toda la lógica de alumnos: carga, paginación, CRUD
export function useAlumnos(filtros = {}) {
  const [alumnos, setAlumnos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await alumnosService.listar({ ...filtros, pagina })
      setAlumnos(res.data.alumnos)
      setTotal(res.data.total)
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar alumnos')
    } finally {
      setCargando(false)
    }
  }, [pagina, JSON.stringify(filtros)])

  // useEffect — actualización: se ejecuta cada vez que cambian filtros o pagina
  useEffect(() => {
    cargar()
  }, [cargar])

  const crear = async (datos) => {
    const res = await alumnosService.crear(datos)
    await cargar()
    return res.data
  }

  const actualizar = async (id, datos) => {
    const res = await alumnosService.actualizar(id, datos)
    await cargar()
    return res.data
  }

  const eliminar = async (id) => {
    await alumnosService.eliminar(id)
    await cargar()
  }

  return { alumnos, cargando, error, total, pagina, setPagina, cargar, crear, actualizar, eliminar }
}

// ── Hook 2: useAvisosInterval ──
// Actualiza avisos automáticamente — cubre: limpieza de useEffect
export function useAvisosInterval(callback, intervalo = 30000) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // useEffect con limpieza: cancela el intervalo al desmontar
  useEffect(() => {
    const id = setInterval(() => callbackRef.current(), intervalo)
    return () => clearInterval(id) // limpieza
  }, [intervalo])
}

// ── Hook 3: useFetch ──
// Hook genérico reutilizable para cualquier petición GET
export function useFetch(servicioFn, deps = []) {
  const [data, setData] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false // evita actualizar estado si el componente se desmontó

    const ejecutar = async () => {
      setCargando(true)
      setError(null)
      try {
        const res = await servicioFn()
        if (!cancelado) setData(res.data)
      } catch (err) {
        if (!cancelado) setError(err.response?.data?.mensaje || 'Error de red')
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    ejecutar()
    return () => { cancelado = true } // limpieza
  }, deps)

  return { data, cargando, error }
}

// ── Hook 4: useDebounce ──
// Retrasa la actualización de un valor — útil para búsquedas en tiempo real
export function useDebounce(valor, delay = 400) {
  const [valorDebounced, setValorDebounced] = useState(valor)

  useEffect(() => {
    const timer = setTimeout(() => setValorDebounced(valor), delay)
    return () => clearTimeout(timer) // limpieza
  }, [valor, delay])

  return valorDebounced
}