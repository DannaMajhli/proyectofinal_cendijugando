// pages/admin/AlumnoDetalle.jsx
// Cubre: rutas con parámetros (useParams), useFetch hook personalizado

import { useParams, Link } from 'react-router-dom'
import { alumnosService, pagosService } from '../../services/api'
import { useFetch } from '../../hooks/index'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Badge } from '../../components/ui/index.jsx'

export default function AlumnoDetalle() {
  // Parámetro de ruta: /admin/alumnos/:id
  const { id } = useParams()

  // Hook personalizado useFetch
  const { data: alumno, cargando, error } = useFetch(() => alumnosService.obtener(id), [id])
  const { data: pagosData } = useFetch(() => pagosService.listarPorAlumno(id), [id])

  if (cargando) return <LoadingSpinner />
  if (error) return <div className="page-container"><div className="alert alert-error">❌ {error}</div></div>
  if (!alumno) return null

  const pagos = pagosData || []

  return (
    <div className="page-container">
      <div className="flex-between mb-2">
        <h1 className="page-title">Detalle del alumno</h1>
        <Link to="/admin/alumnos" className="btn btn-secondary">← Volver</Link>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">👤 Información personal</h3>
            <Badge texto={alumno.activo ? 'Activo' : 'Inactivo'} tipo={alumno.activo ? 'success' : 'warning'} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Nombre', alumno.nombre],
              ['CURP', alumno.curp || '—'],
              ['Fecha de nacimiento', alumno.fecha_nacimiento ? new Date(alumno.fecha_nacimiento).toLocaleDateString('es-MX') : '—'],
              ['Tutor', alumno.nombre_tutor || '—'],
              ['Grupo', alumno.nombre_grupo || '—'],
              ['Ciclo escolar', alumno.ciclo_escolar || '2025-2026'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--gris-borde)' }}>
                <span className="text-muted" style={{ fontSize: 13 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">💰 Historial de pagos</h3>
          </div>
          {pagos.length === 0 ? (
            <p className="text-muted text-center" style={{ padding: 20 }}>Sin pagos registrados</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map(pago => (
                    <tr key={pago.id}>
                      <td>{pago.mes_correspondiente}</td>
                      <td>${pago.monto}</td>
                      <td>{new Date(pago.fecha_pago).toLocaleDateString('es-MX')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
