// pages/public/Registro.jsx
// Cubre: formulario controlado, formulario NO controlado (useRef), validaciones, estados

import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Registro() {
  const { registro } = useAuth()
  const navigate = useNavigate()

  // ── Formulario CONTROLADO: datos del padre ──
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    confirmar: '',
  })
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState('')
  const [errorGeneral, setErrorGeneral] = useState('')

  // ── Formulario NO CONTROLADO (useRef): datos del alumno ──
  // React no controla estos inputs, se leen directamente con .current.value
  const nombreAlumnoRef = useRef(null)
  const fechaNacimientoRef = useRef(null)
  const curpRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!form.correo.trim()) e.correo = 'El correo es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = 'Correo inválido'
    if (!form.contrasena) e.contrasena = 'La contraseña es requerida'
    else if (form.contrasena.length < 6) e.contrasena = 'Mínimo 6 caracteres'
    if (form.contrasena !== form.confirmar) e.confirmar = 'Las contraseñas no coinciden'
    // Validaciones del formulario NO controlado
    if (!nombreAlumnoRef.current?.value.trim()) e.nombreAlumno = 'El nombre del alumno es requerido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorGeneral('')
    setExito('')

    const erroresVal = validar()
    if (Object.keys(erroresVal).length > 0) {
      setErrores(erroresVal)
      return
    }

    setCargando(true)
    try {
      // Combinar datos del formulario controlado e incontrolado
      const datos = {
        nombre: form.nombre,
        correo: form.correo,
        contrasena: form.contrasena,
        nombre_alumno: nombreAlumnoRef.current.value,
        fecha_nacimiento: fechaNacimientoRef.current.value || null,
        curp: curpRef.current.value || null,
      }

      await registro(datos)
      // Estado de éxito — mensaje visual
      setExito('¡Usuario registrado exitosamente! Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setErrorGeneral(err.response?.data?.mensaje || 'Error al registrarse. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 520 }}>
         <button onClick={() => navigate('/')} 
           style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--azul)', fontSize: 14, marginBottom: 8 }}>
          ← Volver 
         </button>
        <div className="auth-logo">
          <div className="emoji">🌟</div>
          <h1>Cendi Jugando</h1>
          <p>Crea tu cuenta de padre de familia</p>
        </div>

        {exito && <div className="alert alert-success"><span>✅</span> {exito}</div>}
        {errorGeneral && <div className="alert alert-error"><span>❌</span> {errorGeneral}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* ── Sección 1: Formulario CONTROLADO ── */}
          <p style={{ fontSize: 12, color: 'var(--azul)', fontWeight: 600, marginBottom: 12 }}>
            📋 Datos del padre/tutor 
          </p>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre completo *</label>
              <input type="text" name="nombre" className={`form-control ${errores.nombre ? 'error' : ''}`}
                value={form.nombre} onChange={handleChange} placeholder="María López García" />
              {errores.nombre && <p className="form-error">{errores.nombre}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Correo electrónico *</label>
              <input type="email" name="correo" className={`form-control ${errores.correo ? 'error' : ''}`}
                value={form.correo} onChange={handleChange} placeholder="correo@ejemplo.com" />
              {errores.correo && <p className="form-error">{errores.correo}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña *</label>
              <input type="password" name="contrasena" className={`form-control ${errores.contrasena ? 'error' : ''}`}
                value={form.contrasena} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
              {errores.contrasena && <p className="form-error">{errores.contrasena}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar contraseña *</label>
              <input type="password" name="confirmar" className={`form-control ${errores.confirmar ? 'error' : ''}`}
                value={form.confirmar} onChange={handleChange} placeholder="Repite tu contraseña" />
              {errores.confirmar && <p className="form-error">{errores.confirmar}</p>}
            </div>
          </div>

          {/* ── Sección 2: Formulario NO CONTROLADO (useRef) ── */}
          <p style={{ fontSize: 12, color: 'var(--azul)', fontWeight: 600, margin: '16px 0 12px' }}>
            👶 Datos del alumno 
          </p>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre del alumno *</label>
              <input type="text" ref={nombreAlumnoRef}
                className={`form-control ${errores.nombreAlumno ? 'error' : ''}`}
                placeholder="Nombre completo del niño/a" />
              {errores.nombreAlumno && <p className="form-error">{errores.nombreAlumno}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de nacimiento</label>
              <input type="date" ref={fechaNacimientoRef} className="form-control" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">CURP (opcional)</label>
              <input type="text" ref={curpRef} className="form-control"
                placeholder="CURP del alumno" maxLength={18}
                style={{ textTransform: 'uppercase' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary"
            disabled={cargando} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  )
}
