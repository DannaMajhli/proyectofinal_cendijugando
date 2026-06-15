import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { avisosService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const SERVICIOS = [
  { emoji: '🍼', titulo: 'Lactantes',    desc: 'Atención especializada para bebés desde los 45 días hasta 1 año y medio.' },
  { emoji: '🌱', titulo: 'Maternal',     desc: 'Estimulación temprana y desarrollo integral para niños de 1 a 3 años.' },
  { emoji: '🎨', titulo: 'Preescolar',   desc: 'Educación preescolar de 1° a 3° grado para niños de 3 a 6 años.' },
  { emoji: '🕐', titulo: 'Horario',      desc: 'Lunes a viernes de 7:00 a.m. a 4:00 p.m.' },
  { emoji: '🍱', titulo: 'Alimentación', desc: 'Servicio de desayuno y comida nutritiva incluida.' },
  { emoji: '🏃', titulo: 'Actividades',  desc: 'Música, psicomotricidad, inglés y actividades lúdicas.' },
]

export default function Inicio() {
  const { usuario } = useAuth()
  const [avisosPublicos, setAvisosPublicos] = useState([])

  useEffect(() => {
    const cargarAvisos = async () => {
      try {
        const res = await avisosService.listarPublicos()
        setAvisosPublicos(res.data)
      } catch { }
    }
    cargarAvisos()
  }, [])

  return (
    <div>
      <div className="hero">
        <img src="/CendiJugando.png" alt="Cendi Jugando" style={{ height: 80, width: 'auto', marginBottom: 16, borderRadius: 10 }} />
        <h1>Bienvenidos a Cendi Jugando 🌟</h1>
        <p>Centro de Desarrollo Infantil · Aguascalientes, Ags.<br />
          Formando niños felices, seguros y creativos</p>
        <div className="hero-btns">
          {!usuario ? (
            <>
              <Link to="/registro" className="btn" style={{ background: 'var(--amarillo)', color: 'var(--azul)', fontWeight: 600 }}>Registrarse</Link>
              <Link to="/login" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>Iniciar sesión</Link>
            </>
          ) : (
            <Link to={usuario.rol === 'admin' ? '/admin' : '/padre'} className="btn" style={{ background: 'var(--amarillo)', color: 'var(--azul)', fontWeight: 600 }}>Ir a mi panel →</Link>
          )}
        </div>
      </div>

      <div className="page-container">
        <h2 className="page-title">Nuestros servicios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
          {SERVICIOS.map((s) => (
            <div key={s.titulo} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{s.emoji}</div>
              <h3 style={{ color: 'var(--azul)', marginBottom: 6 }}>{s.titulo}</h3>
              <p className="text-muted" style={{ fontSize: 13 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {avisosPublicos.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 className="page-title">Avisos recientes</h2>
            {avisosPublicos.map((a) => (
              <div key={a.id} className="aviso-card">
                <h4>{a.titulo}</h4>
                <p>{a.contenido}</p>
                <p className="aviso-meta">{new Date(a.fecha_publicacion).toLocaleDateString('es-MX', { dateStyle: 'long' })}</p>
              </div>
            ))}
          </div>
        )}

        <h2 className="page-title">Contacto</h2>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><strong>📍 Dirección</strong><p className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>Calle Francisco González Bocanegra N,<br />20180 Aguascalientes, Ags.</p></div>
              <div><strong>📞 Teléfono</strong><p className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>(449) 975 0700</p></div>
              <div><strong>✉️ Correo</strong><p className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>cendi_jugandosc@yahoo.com.mx</p></div>
              <div><strong>🕐 Horario</strong><p className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>Lunes a Viernes: 7:00 a.m. – 4:00 p.m.</p></div>
            </div>
            <div style={{ background: 'var(--azul-light)', borderRadius: 8, padding: 20 }}>
              <strong style={{ color: 'var(--azul)' }}>🏫 Grupos disponibles</strong>
              <ul style={{ marginTop: 10, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {['Lactantes','Maternal A','Maternal B1','Maternal B2','Preescolar 1°A','Preescolar 1°B','Preescolar 2°A','Preescolar 2°B','Preescolar 3°A','Preescolar 3°B'].map(g => (
                  <li key={g} style={{ fontSize: 13, color: 'var(--texto-muted)' }}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
