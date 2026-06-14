// pages/admin/Alumnos.jsx
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAlumnos, useDebounce, useFetch } from '../../hooks/index'
import { Modal, Badge } from '../../components/ui/index.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import FormularioAlumno from './FormularioAlumno'
import { gruposService } from '../../services/api'

export default function Alumnos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const busquedaParam = searchParams.get('busqueda') || ''
  const grupoParam = searchParams.get('grupo') || ''

  const [busqueda, setBusqueda] = useState(busquedaParam)
  const busquedaDebounced = useDebounce(busqueda, 400)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [alumnoEditar, setAlumnoEditar] = useState(null)
  const [confirmEliminar, setConfirmEliminar] = useState(null)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })

  // Hook personalizado — maneja toda la lógica de alumnos
  const { alumnos, cargando, error, total, pagina, setPagina, crear, actualizar, eliminar } =
    useAlumnos({ busqueda: busquedaDebounced, grupo: grupoParam })

  // Carga grupos dinámicamente desde la BD
  const { data: grupos } = useFetch(() => gruposService.listar(), [])

  const handleBusqueda = (e) => {
    const val = e.target.value
    setBusqueda(val)
    setSearchParams(val ? { busqueda: val } : {})
  }

  const handleGuardar = async (datos) => {
    try {
      if (alumnoEditar) {
        await actualizar(alumnoEditar.id, datos)
        setMensaje({ tipo: 'success', texto: '✅ Alumno actualizado correctamente' })
      } else {
        await crear(datos)
        setMensaje({ tipo: 'success', texto: '✅ Alumno registrado correctamente' })
      }
      setModalAbierto(false)
      setAlumnoEditar(null)
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.mensaje || '❌ Error al guardar' })
    }
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
  }

  const handleEliminar = async (id) => {
    try {
      await eliminar(id)
      setMensaje({ tipo: 'success', texto: '✅ Alumno eliminado' })
      setConfirmEliminar(null)
    } catch {
      setMensaje({ tipo: 'error', texto: '❌ Error al eliminar' })
    }
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
  }

  const abrirEditar = (alumno) => { setAlumnoEditar(alumno); setModalAbierto(true) }
  const abrirNuevo = () => { setAlumnoEditar(null); setModalAbierto(true) }
  const totalPaginas = Math.ceil(total / 10)

  return (
    <div className="page-container">
      <div className="flex-between mb-2">
        <h1 className="page-title">Gestión de Alumnos</h1>
        <button className="btn btn-primary" onClick={abrirNuevo}>+ Nuevo alumno</button>
      </div>

      {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}

      {/* Filtros */}
      <div className="card mb-2">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por nombre..."
            value={busqueda}
            onChange={handleBusqueda}
            style={{ maxWidth: 260 }}
          />
          {/* Grupos cargados dinámicamente desde la BD */}
          <select
            className="form-control"
            style={{ maxWidth: 200 }}
            value={grupoParam}
            onChange={e => setSearchParams(e.target.value ? { grupo: e.target.value } : {})}
          >
            <option value="">Todos los grupos</option>
            {(grupos || []).map(g => (
              <option key={g.id} value={g.nombre}>{g.nombre}</option>
            ))}
          </select>
          <span className="text-muted" style={{ alignSelf: 'center', fontSize: 13 }}>
            {total} alumnos encontrados
          </span>
        </div>
      </div>

      {cargando ? <LoadingSpinner /> : error ? (
        <div className="alert alert-error">❌ {error}</div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Grupo</th>
                  <th>Tutor</th>
                  <th>CURP</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((alumno) => (
                  <tr key={alumno.id}>
                    <td>
                      <strong>{alumno.nombre}</strong>
                      <br />
                      <span className="text-muted" style={{ fontSize: 12 }}>
                        {alumno.fecha_nacimiento
                          ? new Date(alumno.fecha_nacimiento).toLocaleDateString('es-MX')
                          : 'Sin fecha'}
                      </span>
                    </td>
                    <td>{alumno.nombre_grupo || '—'}</td>
                    <td>{alumno.nombre_tutor || '—'}</td>
                    <td style={{ fontSize: 12 }}>{alumno.curp || '—'}</td>
                    <td>
                      <Badge
                        texto={alumno.activo ? 'Activo' : 'Inactivo'}
                        tipo={alumno.activo ? 'success' : 'warning'}
                      />
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/admin/alumnos/${alumno.id}`} className="btn btn-secondary btn-sm">👁 Ver</Link>
                        <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(alumno)}>✏️ Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmEliminar(alumno)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {alumnos.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted" style={{ padding: 24 }}>No se encontraron alumnos</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${p === pagina ? 'active' : ''}`} onClick={() => setPagina(p)}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal
        abierto={modalAbierto}
        titulo={alumnoEditar ? 'Editar alumno' : 'Registrar nuevo alumno'}
        onClose={() => { setModalAbierto(false); setAlumnoEditar(null) }}
      >
        <FormularioAlumno alumno={alumnoEditar} onGuardar={handleGuardar} onCancelar={() => setModalAbierto(false)} />
      </Modal>

      <Modal abierto={!!confirmEliminar} titulo="Confirmar eliminación" onClose={() => setConfirmEliminar(null)}>
        <div className="modal-body">
          <p>¿Estás seguro de eliminar a <strong>{confirmEliminar?.nombre}</strong>? Esta acción no se puede deshacer.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setConfirmEliminar(null)}>Cancelar</button>
          <button className="btn btn-danger" onClick={() => handleEliminar(confirmEliminar.id)}>Eliminar</button>
        </div>
      </Modal>
    </div>
  )
}