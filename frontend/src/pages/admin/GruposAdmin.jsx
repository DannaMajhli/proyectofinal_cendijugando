// pages/admin/GruposAdmin.jsx
import { useState } from 'react'
import { gruposService } from '../../services/api'
import { useFetch } from '../../hooks/index'
import { Modal } from '../../components/ui/index.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function GruposAdmin() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [grupoEditar, setGrupoEditar] = useState(null)
  const [form, setForm] = useState({ nombre: '', nivel: '' })
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [refetch, setRefetch] = useState(0)

  const { data: grupos, cargando } = useFetch(() => gruposService.listar(), [refetch])

  const NIVELES = ['Maternal 1', 'Maternal 2', 'Preescolar 1', 'Preescolar 2', 'Preescolar 3']

  const abrirNuevo = () => { setGrupoEditar(null); setForm({ nombre: '', nivel: '' }); setModalAbierto(true) }
  const abrirEditar = (g) => { setGrupoEditar(g); setForm({ nombre: g.nombre, nivel: g.nivel }); setModalAbierto(true) }

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!form.nivel) e.nivel = 'Selecciona un nivel'
    return e
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    const ev = validar()
    if (Object.keys(ev).length > 0) { setErrores(ev); return }
    try {
      if (grupoEditar) await gruposService.actualizar(grupoEditar.id, form)
      else await gruposService.crear(form)
      setMensaje({ tipo: 'success', texto: grupoEditar ? '✅ Grupo actualizado' : '✅ Grupo creado' })
      setModalAbierto(false)
      setRefetch(r => r + 1)
    } catch {
      setMensaje({ tipo: 'error', texto: '❌ Error al guardar' })
    }
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este grupo?')) return
    await gruposService.eliminar(id)
    setMensaje({ tipo: 'success', texto: '✅ Grupo eliminado' })
    setRefetch(r => r + 1)
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
  }

  return (
    <div className="page-container">
      <div className="flex-between mb-2">
        <h1 className="page-title">Gestión de Grupos</h1>
        <button className="btn btn-primary" onClick={abrirNuevo}>+ Nuevo grupo</button>
      </div>

      {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}

      {cargando ? <LoadingSpinner /> : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Nombre del grupo</th><th>Nivel</th><th>Alumnos</th><th>Acciones</th></tr></thead>
              <tbody>
                {(grupos || []).map(g => (
                  <tr key={g.id}>
                    <td><strong>{g.nombre}</strong></td>
                    <td>{g.nivel}</td>
                    <td>{g.total_alumnos || 0}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(g)}>✏️ Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(g.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!grupos || grupos.length === 0) && <tr><td colSpan={4} className="text-center text-muted" style={{ padding: 24 }}>No hay grupos creados</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal abierto={modalAbierto} titulo={grupoEditar ? 'Editar grupo' : 'Crear grupo'} onClose={() => setModalAbierto(false)}>
        <div className="modal-body">
          <form id="form-grupo" onSubmit={handleGuardar}>
            <div className="form-group">
              <label className="form-label">Nombre del grupo *</label>
              <input type="text" className={`form-control ${errores.nombre ? 'error' : ''}`}
                value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Girasoles" />
              {errores.nombre && <p className="form-error">{errores.nombre}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Nivel *</label>
              <select className={`form-control ${errores.nivel ? 'error' : ''}`}
                value={form.nivel} onChange={e => setForm(p => ({ ...p, nivel: e.target.value }))}>
                <option value="">Selecciona un nivel</option>
                {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              {errores.nivel && <p className="form-error">{errores.nivel}</p>}
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
          <button type="submit" form="form-grupo" className="btn btn-primary">
            {grupoEditar ? 'Actualizar' : 'Crear grupo'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
