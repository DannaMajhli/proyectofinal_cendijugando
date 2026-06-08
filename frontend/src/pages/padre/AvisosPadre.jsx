// pages/padre/AvisosPadre.jsx
import { useFetch } from '../../hooks/index'
import { useAvisosInterval } from '../../hooks/index'
import { avisosService } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useState, useCallback } from 'react'

export default function AvisosPadre() {
  const [refetch, setRefetch] = useState(0)
  const { data: avisos, cargando, error } = useFetch(() => avisosService.listar(), [refetch])

  // Hook personalizado useAvisosInterval — actualiza automáticamente cada 30s (limpieza de efecto)
  const recargar = useCallback(() => setRefetch(r => r + 1), [])
  useAvisosInterval(recargar, 30000)

  return (
    <div className="page-container">
      <h1 className="page-title">📢 Avisos del kinder</h1>
      <p className="text-muted mb-2" style={{ fontSize: 13 }}>Se actualizan automáticamente cada 30 segundos</p>

      {cargando ? <LoadingSpinner /> : error ? (
        <div className="alert alert-error">❌ {error}</div>
      ) : (
        <div>
          {(avisos || []).map(a => (
            <div key={a.id} className="aviso-card">
              <h4>{a.titulo}</h4>
              <p>{a.contenido}</p>
              <p className="aviso-meta">
                {new Date(a.fecha_publicacion).toLocaleDateString('es-MX', { dateStyle: 'long' })}
                {a.fecha_vigencia && ` · Vigente hasta: ${new Date(a.fecha_vigencia).toLocaleDateString('es-MX')}`}
              </p>
            </div>
          ))}
          {(!avisos || avisos.length === 0) && (
            <div className="card text-center text-muted" style={{ padding: 32 }}>No hay avisos disponibles</div>
          )}
        </div>
      )}
    </div>
  )
}
