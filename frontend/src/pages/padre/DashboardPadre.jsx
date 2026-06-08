// pages/padre/DashboardPadre.jsx
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/index'
import { avisosService } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function DashboardPadre() {
  const { usuario } = useAuth()
  const { data: avisos, cargando } = useFetch(() => avisosService.listar(), [])

  return (
    <div className="page-container">
      <h1 className="page-title">Bienvenido, {usuario?.nombre?.split(' ')[0]} 👋</h1>
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📢 Últimos avisos</h3>
            <Link to="/padre/avisos" className="btn btn-secondary btn-sm">Ver todos</Link>
          </div>
          {cargando ? <LoadingSpinner /> : (
            <div>
              {(avisos || []).slice(0, 3).map(a => (
                <div key={a.id} className="aviso-card">
                  <h4>{a.titulo}</h4>
                  <p>{a.contenido}</p>
                </div>
              ))}
              {(!avisos || avisos.length === 0) && <p className="text-muted">Sin avisos recientes</p>}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">👶 Mi hijo</h3>
              <Link to={`/padre/hijo/${usuario?.alumno_id}`} className="btn btn-secondary btn-sm">Ver perfil</Link>
            </div>
            <p className="text-muted" style={{ fontSize: 13 }}>Consulta la información escolar de tu hijo.</p>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">💰 Pagos</h3>
              <Link to="/padre/pagos" className="btn btn-secondary btn-sm">Ver pagos</Link>
            </div>
            <p className="text-muted" style={{ fontSize: 13 }}>Revisa el estado de tus mensualidades.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
