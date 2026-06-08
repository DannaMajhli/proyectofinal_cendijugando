// pages/padre/MiHijo.jsx — ruta con parámetro :id
import { useParams } from 'react-router-dom'
import { alumnosService } from '../../services/api'
import { useFetch } from '../../hooks/index'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Badge } from '../../components/ui/index.jsx'

export default function MiHijo() {
  const { id } = useParams() // parámetro de ruta

  const { data: alumno, cargando, error } = useFetch(
    () => alumnosService.obtener(id),
    [id]
  )

  if (cargando) return <LoadingSpinner />
  if (error) return <div className="page-container"><div className="alert alert-error">❌ {error}</div></div>
  if (!alumno) return null

  return (
    <div className="page-container">
      <h1 className="page-title">👶 Perfil de mi hijo</h1>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{alumno.nombre}</h3>
          <Badge texto={alumno.activo ? 'Inscrito' : 'Inactivo'} tipo={alumno.activo ? 'success' : 'warning'} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            ['Grupo', alumno.nombre_grupo || '—'],
            ['Nivel', alumno.nivel_grupo || '—'],
            ['Fecha de nacimiento', alumno.fecha_nacimiento ? new Date(alumno.fecha_nacimiento).toLocaleDateString('es-MX') : '—'],
            ['Ciclo escolar', '2025–2026'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-muted" style={{ fontSize: 12 }}>{label}</p>
              <p style={{ fontWeight: 500 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
