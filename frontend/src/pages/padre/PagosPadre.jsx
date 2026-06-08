// pages/padre/PagosPadre.jsx
// Cubre: query params (?mes=junio&anio=2026), renderizado de lista, Badge

import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { pagosService } from '../../services/api'
import { useFetch } from '../../hooks/index'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Badge } from '../../components/ui/index.jsx'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function PagosPadre() {
  const { usuario } = useAuth()
  // Query params: /padre/pagos?mes=Junio&anio=2026
  const [searchParams, setSearchParams] = useSearchParams()
  const mesParam = searchParams.get('mes') || ''
  const anioParam = searchParams.get('anio') || ''

  const { data: pagos, cargando, error } = useFetch(
    () => pagosService.listarPorAlumno(usuario?.alumno_id),
    [usuario?.alumno_id]
  )

  const pagosFiltrados = (pagos || []).filter(p => {
    if (mesParam && !p.mes_correspondiente.includes(mesParam)) return false
    if (anioParam && !p.mes_correspondiente.includes(anioParam)) return false
    return true
  })

  return (
    <div className="page-container">
      <h1 className="page-title">💰 Mis pagos</h1>

      {/* Filtros con query params */}
      <div className="card mb-2">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="text-muted" style={{ fontSize: 13 }}>Filtrar:</span>
          <select className="form-control" style={{ maxWidth: 140 }} value={mesParam}
            onChange={e => { const p = new URLSearchParams(searchParams); e.target.value ? p.set('mes', e.target.value) : p.delete('mes'); setSearchParams(p) }}>
            <option value="">Todos los meses</option>
            {MESES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="form-control" style={{ maxWidth: 120 }} value={anioParam}
            onChange={e => { const p = new URLSearchParams(searchParams); e.target.value ? p.set('anio', e.target.value) : p.delete('anio'); setSearchParams(p) }}>
            <option value="">Todos los años</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
      </div>

      {cargando ? <LoadingSpinner /> : error ? (
        <div className="alert alert-error">❌ {error}</div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Mes</th><th>Concepto</th><th>Monto</th><th>Fecha de pago</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {pagosFiltrados.map(p => (
                  <tr key={p.id}>
                    <td>{p.mes_correspondiente}</td>
                    <td>{p.concepto || 'Mensualidad'}</td>
                    <td>${Number(p.monto).toLocaleString('es-MX')}</td>
                    <td>{new Date(p.fecha_pago).toLocaleDateString('es-MX')}</td>
                    <td><Badge texto="Pagado" tipo="success" /></td>
                  </tr>
                ))}
                {pagosFiltrados.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-muted" style={{ padding: 24 }}>Sin pagos para este filtro</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
