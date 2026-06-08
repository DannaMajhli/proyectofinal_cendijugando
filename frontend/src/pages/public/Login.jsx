// pages/public/Login.jsx
// Cubre: formulario controlado, validaciones, estados carga/éxito/error, async/await, eventos

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // Formulario controlado — estado local con useState
  const [form, setForm] = useState({ correo: '', contrasena: '' })
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  // Manejo de eventos: onChange actualiza el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // limpiar error del campo al escribir
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  // Validaciones del formulario controlado
  const validar = () => {
    const nuevosErrores = {}
    if (!form.correo.trim()) {
      nuevosErrores.correo = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      nuevosErrores.correo = 'Formato de correo inválido'
    }
    if (!form.contrasena) {
      nuevosErrores.contrasena = 'La contraseña es requerida'
    } else if (form.contrasena.length < 6) {
      nuevosErrores.contrasena = 'Mínimo 6 caracteres'
    }
    return nuevosErrores
  }

  // Función anidada: construye el mensaje de bienvenida según el rol
  const mensajeBienvenida = (usuario) => {
    const nombre = usuario.nombre.split(' ')[0]
    // función anidada dentro de mensajeBienvenida
    const obtenerRolTexto = (rol) => rol === 'admin' ? 'Administrador' : 'Padre de familia'
    return `¡Bienvenido, ${nombre}! (${obtenerRolTexto(usuario.rol)})`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorGeneral('')

    // Validar antes de enviar
    const erroresValidacion = validar()
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    setCargando(true)
    try {
      // async/await para el login
      const usuario = await login(form.correo, form.contrasena)
      // Redirigir según el rol
      if (usuario.rol === 'admin') navigate('/admin')
      else navigate('/padre')
    } catch (err) {
      // Estado de error — mensaje en pantalla, no alert()
      setErrorGeneral(err.response?.data?.mensaje || 'Credenciales incorrectas. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="emoji">🌟</div>
          <h1>Cendi Jugando</h1>
          <p>Inicia sesión en tu cuenta</p>
        </div>

        {/* Estado de error — mensaje visual, no alert */}
        {errorGeneral && (
          <div className="alert alert-error">
            <span>❌</span> {errorGeneral}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              name="correo"
              className={`form-control ${errores.correo ? 'error' : ''}`}
              value={form.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
            />
            {errores.correo && <p className="form-error">{errores.correo}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              name="contrasena"
              className={`form-control ${errores.contrasena ? 'error' : ''}`}
              value={form.contrasena}
              onChange={handleChange}
              placeholder="Tu contraseña"
              autoComplete="current-password"
            />
            {errores.contrasena && <p className="form-error">{errores.contrasena}</p>}
          </div>

          {/* Estado de carga: deshabilita el botón y muestra texto */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={cargando}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          >
            {cargando ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  )
}
