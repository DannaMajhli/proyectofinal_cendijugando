// components/ui/Notificaciones.jsx
import { useState, useRef, useEffect } from 'react'
import { useNotificaciones } from '../../context/NotificacionesContext'
import { useAuth } from '../../context/AuthContext'

export default function Notificaciones() {
  const { usuario } = useAuth()
  const { avisosNoLeidos, avisosRecientes, marcarTodosLeidos } = useNotificaciones()
  const [abierto, setAbierto] = useState(false)
  const ref = useRef(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!usuario) return null

  const handleAbrir = () => {
    setAbierto(!abierto)
    if (!abierto) marcarTodosLeidos()
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Campana */}
      <button
        onClick={handleAbrir}
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          borderRadius: '8px',
          padding: '6px 10px',
          cursor: 'pointer',
          position: 'relative',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        🔔
        {/* Contador rojo */}
        {avisosNoLeidos > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: '#E53935',
            color: 'white',
            borderRadius: '50%',
            width: 18,
            height: 18,
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial',
          }}>
            {avisosNoLeidos > 9 ? '9+' : avisosNoLeidos}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {abierto && (
        <div style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          width: 320,
          background: 'var(--blanco)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 300,
          overflow: 'hidden',
          border: '1px solid var(--gris-borde)',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            background: 'var(--azul)',
            color: 'white',
            fontWeight: 600,
            fontSize: 14,
            fontFamily: 'Arial',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>🔔 Notificaciones</span>
            {avisosNoLeidos === 0 && <span style={{ fontSize: 11, opacity: 0.8 }}>Todas leídas</span>}
          </div>

          {/* Lista de avisos */}
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {avisosRecientes.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--texto-muted)', fontSize: 13 }}>
                Sin notificaciones
              </div>
            ) : (
              avisosRecientes.map((aviso) => (
                <div key={aviso.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--gris-borde)',
                  borderLeft: '3px solid var(--azul)',
                }}>
                  <p style={{ fontWeight: 600, fontSize: 13, margin: '0 0 4px', color: 'var(--texto)' }}>
                    {aviso.titulo}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--texto-muted)', margin: '0 0 4px' }}>
                    {aviso.contenido.length > 80
                      ? aviso.contenido.slice(0, 80) + '...'
                      : aviso.contenido}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--texto-muted)', margin: 0 }}>
                    {new Date(aviso.fecha_publicacion).toLocaleDateString('es-MX', { dateStyle: 'medium' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
