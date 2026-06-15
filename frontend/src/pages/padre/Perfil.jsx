// pages/padre/Perfil.jsx
// Permite al padre editar su nombre y contraseña

import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function Perfil() {
  const { usuario } = useAuth()

  // Formulario controlado — cambiar nombre
  const [formNombre, setFormNombre] = useState({ nombre: usuario?.nombre || '' })
  const [mensajeNombre, setMensajeNombre] = useState({ tipo: '', texto: '' })
  const [cargandoNombre, setCargandoNombre] = useState(false)

  // Formulario no controlado — cambiar contraseña (useRef)
  const contrasenaActualRef = useRef(null)
  const contrasenaNuevaRef = useRef(null)
  const confirmarRef = useRef(null)
  const [erroresPass, setErroresPass] = useState({})
  const [mensajePass, setMensajePass] = useState({ tipo: '', texto: '' })
  const [cargandoPass, setCargandoPass] = useState(false)

  const handleGuardarNombre = async (e) => {
    e.preventDefault()
    if (!formNombre.nombre.trim()) return
    setCargandoNombre(true)
    try {
      await api.put('/auth/perfil', { nombre: formNombre.nombre })
      setMensajeNombre({ tipo: 'success', texto: '✅ Nombre actualizado correctamente' })
    } catch (err) {
      setMensajeNombre({ tipo: 'error', texto: '❌ Error al actualizar el nombre' })
    } finally {
      setCargandoNombre(false)
      setTimeout(() => setMensajeNombre({ tipo: '', texto: '' }), 3000)
    }
  }

  const handleCambiarContrasena = async (e) => {
    e.preventDefault()
    const actual = contrasenaActualRef.current.value
    const nueva = contrasenaNuevaRef.current.value
    const confirmar = confirmarRef.current.value

    // Validaciones del formulario no controlado
    const errs = {}
    if (!actual) errs.actual = 'Ingresa tu contraseña actual'
    if (!nueva || nueva.length < 6) errs.nueva = 'Mínimo 6 caracteres'
    if (nueva !== confirmar) errs.confirmar = 'Las contraseñas no coinciden'

    if (Object.keys(errs).length > 0) {
      setErroresPass(errs)
      return
    }
    setErroresPass({})
    setCargandoPass(true)
    try {
      await api.put('/auth/cambiar-contrasena', {
        contrasena_actual: actual,
        contrasena_nueva: nueva,
      })
      setMensajePass({ tipo: 'success', texto: '✅ Contraseña actualizada correctamente' })
      contrasenaActualRef.current.value = ''
      contrasenaNuevaRef.current.value = ''
      confirmarRef.current.value = ''
    } catch (err) {
      setMensajePass({ tipo: 'error', texto: err.response?.data?.mensaje || '❌ Error al cambiar contraseña' })
    } finally {
      setCargandoPass(false)
      setTimeout(() => setMensajePass({ tipo: '', texto: '' }), 3000)
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">👤 Mi perfil</h1>

      <div className="grid-2">
        {/* Cambiar nombre — formulario controlado */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Información personal</h3>
          </div>
          <div style={{ marginBottom: 16, padding: '12px', background: 'var(--azul-light)', borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--texto-muted)', margin: '0 0 4px' }}>Correo electrónico</p>
            <p style={{ fontWeight: 600, margin: 0 }}>{usuario?.correo}</p>
          </div>
          {mensajeNombre.texto && (
            <div className={`alert alert-${mensajeNombre.tipo}`}>{mensajeNombre.texto}</div>
          )}
          <form onSubmit={handleGuardarNombre}>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input
                type="text"
                className="form-control"
                value={formNombre.nombre}
                onChange={e => setFormNombre({ nombre: e.target.value })}
                placeholder="Tu nombre completo"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={cargandoNombre}
              style={{ width: '100%', justifyContent: 'center' }}>
              {cargandoNombre ? 'Guardando...' : 'Guardar nombre'}
            </button>
          </form>
        </div>

        {/* Cambiar contraseña — formulario NO controlado */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Cambiar contraseña</h3>
          </div>
          {mensajePass.texto && (
            <div className={`alert alert-${mensajePass.tipo}`}>{mensajePass.texto}</div>
          )}
          <form onSubmit={handleCambiarContrasena}>
            <div className="form-group">
              <label className="form-label">Contraseña actual</label>
              <input type="password" ref={contrasenaActualRef}
                className={`form-control ${erroresPass.actual ? 'error' : ''}`}
                placeholder="Tu contraseña actual" />
              {erroresPass.actual && <p className="form-error">{erroresPass.actual}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Nueva contraseña</label>
              <input type="password" ref={contrasenaNuevaRef}
                className={`form-control ${erroresPass.nueva ? 'error' : ''}`}
                placeholder="Mínimo 6 caracteres" />
              {erroresPass.nueva && <p className="form-error">{erroresPass.nueva}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar nueva contraseña</label>
              <input type="password" ref={confirmarRef}
                className={`form-control ${erroresPass.confirmar ? 'error' : ''}`}
                placeholder="Repite la nueva contraseña" />
              {erroresPass.confirmar && <p className="form-error">{erroresPass.confirmar}</p>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={cargandoPass}
              style={{ width: '100%', justifyContent: 'center' }}>
              {cargandoPass ? 'Cambiando...' : 'Cambiar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
