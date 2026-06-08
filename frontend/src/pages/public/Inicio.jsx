// pages/public/Inicio.jsx
// Cubre: componente funcional, renderizado de listas, renderizado condicional

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { avisosService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const SERVICIOS = [
  { emoji: '🍼', titulo: 'Maternal', desc: 'Atención para niños de 1 a 3 años en un ambiente seguro y estimulante.' },
  { emoji: '🎨', titulo: 'Preescolar', desc: 'Desarrollo integral para niños de 3 a 6 años con actividades lúdicas.' },
  { emoji: '🕐', titulo: 'Horario extendido', desc: 'Servicio de lunes a viernes de 7:00 a.m. a 4:00 p.m.' },
]

export default function Inicio() {
  const { usuario } = useAuth()
  const [avisosPublicos, setAvisosPublicos] = useState([])

  // useEffect montaje: carga avisos públicos al cargar la página
  useEffect(() => {
    const cargarAvisos = async () => {
      try {
        const res = await avisosService.listarPublicos()
        setAvisosPublicos(res.data)
      } catch {
        // si falla simplemente no muestra avisos
      }
    }
    cargarAvisos()
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <h1>Bienvenidos a Cendi Jugando 🌟</h1>
        <p>Centro de Desarrollo Infantil · Aguascalientes, Ags.</p>
        {/* Renderizado condicional: botones según si hay sesión o no */}
        <div className="hero-btns">
          {!usuario ? (
            <>
              <Link to="/registro" className="btn" style={{ background: 'var(--amarillo)', color: 'var(--azul)', fontWeight: 600 }}>
                Registrarse
              </Link>
              <Link to="/login" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
                Iniciar sesión
              </Link>
            </>
          ) : (
            <Link to={usuario.rol === 'admin' ? '/admin' : '/padre'} className="btn" style={{ background: 'var(--amarillo)', color: 'var(--azul)', fontWeight: 600 }}>
              Ir a mi panel →
            </Link>
          )}
        </div>
      </div>

      <div className="page-container">
        {/* Servicios — renderizado de lista */}
        <h2 className="page-title">Nuestros servicios</h2>
        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 32 }}>
          {SERVICIOS.map((s) => (
            <div key={s.titulo} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{s.emoji}</div>
              <h3 style={{ color: 'var(--azul)', marginBottom: 6 }}>{s.titulo}</h3>
              <p className="text-muted" style={{ fontSize: 13 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Avisos públicos — renderizado condicional de lista */}
        {avisosPublicos.length > 0 && (
          <div>
            <h2 className="page-title">Avisos recientes</h2>
            {avisosPublicos.map((aviso) => (
              <div key={aviso.id} className="aviso-card">
                <h4>{aviso.titulo}</h4>
                <p>{aviso.contenido}</p>
                <p className="aviso-meta">{new Date(aviso.fecha_publicacion).toLocaleDateString('es-MX', { dateStyle: 'long' })}</p>
              </div>
            ))}
          </div>
        )}

        {/* Info de contacto */}
        <div className="card mt-2" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
          <div><strong>📍 Ubicación</strong><br /><span className="text-muted">Aguascalientes, Ags.</span></div>
          <div><strong>📞 Teléfono</strong><br /><span className="text-muted">(449) 000-0000</span></div>
          <div><strong>✉️ Correo</strong><br /><span className="text-muted">cendijugando@email.com</span></div>
          <div><strong>🕐 Horario</strong><br /><span className="text-muted">Lun–Vie 7:00 am – 4:00 pm</span></div>
        </div>
      </div>
    </div>
  )
}
