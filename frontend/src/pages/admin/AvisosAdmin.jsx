// pages/admin/AvisosAdmin.jsx
import { useState } from 'react'
import { avisosService } from '../../services/api'
import { useFetch } from '../../hooks/index'
import { Modal } from '../../components/ui/index.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function AvisosAdmin() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [avisoEditar, setAvisoEditar] = useState(null)
  const [form, setForm] = useState({ titulo: '', contenido: '', publico: false, fecha_vigencia: '' })
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [cargandoGuardar, setCargandoGuardar] = useState(false)
  const [refetch, setRefetch] = useState(0)

  const { data: avisos, cargando } = useFetch(() => avisosService.listar(), [refetch])

  const abrirNuevo = () => { setAvisoEditar(null); setForm({ titulo: '', contenido: '', publico: false, fecha_vigencia: '' }); setModalAbierto(true) }
  const abrirEditar = (a) => { setAvisoEditar(a); setForm({ titulo: a.titulo, contenido: a.contenido, publico: !!a.publico, fecha_vigencia: a.fecha_vigencia?.split('T')[0] || '' }); setModalAbierto(true) }

  const validar = () => {
    const e = {}
    if (!form.titulo.trim()) e.titulo = 'El título es requerido'
    if (!form.contenido.trim()) e.contenido = 'El contenido es requerido'
    return e
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    const ev = validar()
    if (Object.keys(ev).length > 0) { setErrores(ev); return }
    setCargandoGuardar(true)
    try {
      if (avisoEditar) await avisosService.actualizar(avisoEditar.id, form)
      else await avisosService.crear(form)
      setMensaje({ tipo: 'success', texto: avisoEditar ? '✅ Aviso actualizado' : '✅ Aviso publicado' })
      setModalAbierto(false)
      setRefetch(r => r + 1)
    } catch {
      setMensaje({ tipo: 'error', texto: '❌ Error al guardar aviso' })
    } finally {
      setCargandoGuardar(false)
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este aviso?')) return
    await avisosService.eliminar(id)
    setMensaje({ tipo: 'success', texto: '✅ Aviso eliminado' })
    setRefetch(r => r + 1)
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
  }

  return (
    <div className="page-container">
      <div className="flex-between mb-2">
        <h1 className="page-title">Gestión de Avisos</h1>
        <button className="btn btn-primary" onClick={abrirNuevo}>+ Nuevo aviso</button>
      </div>

      {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}

      {cargando ? <LoadingSpinner /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(avisos || []).map(aviso => (
            <div key={aviso.id} className="aviso-card">
              <div className="flex-between">
                <h4>{aviso.titulo}</h4>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, background: aviso.publico ? 'var(--verde-bg)' : 'var(--gris)', color: aviso.publico ? 'var(--verde)' : 'var(--texto-muted)', padding: '2px 8px', borderRadius: 12 }}>
                    {aviso.publico ? 'Público' : 'Solo padres'}
                  </span>
                  <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(aviso)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(aviso.id)}>🗑️</button>
                </div>
              </div>
              <p>{aviso.contenido}</p>
              <p className="aviso-meta">{new Date(aviso.fecha_publicacion).toLocaleDateString('es-MX', { dateStyle: 'long' })}</p>
            </div>
          ))}
          {(!avisos || avisos.length === 0) && <div className="card text-center text-muted" style={{ padding: 32 }}>No hay avisos publicados</div>}
        </div>
      )}

      <Modal abierto={modalAbierto} titulo={avisoEditar ? 'Editar aviso' : 'Publicar aviso'} onClose={() => setModalAbierto(false)}>
        <div className="modal-body">
          <form id="form-aviso" onSubmit={handleGuardar}>
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input type="text" className={`form-control ${errores.titulo ? 'error' : ''}`}
                value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Título del aviso" />
              {errores.titulo && <p className="form-error">{errores.titulo}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Contenido *</label>
              <textarea className={`form-control ${errores.contenido ? 'error' : ''}`} rows={4}
                value={form.contenido} onChange={e => setForm(p => ({ ...p, contenido: e.target.value }))} placeholder="Mensaje del aviso..." />
              {errores.contenido && <p className="form-error">{errores.contenido}</p>}
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Fecha de vigencia</label>
                <input type="date" className="form-control" value={form.fecha_vigencia}
                  onChange={e => setForm(p => ({ ...p, fecha_vigencia: e.target.value }))} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
                <input type="checkbox" id="publico" checked={form.publico}
                  onChange={e => setForm(p => ({ ...p, publico: e.target.checked }))} />
                <label htmlFor="publico" className="form-label" style={{ marginBottom: 0 }}>Visible públicamente</label>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
          <button type="submit" form="form-aviso" className="btn btn-primary" disabled={cargandoGuardar}>
            {cargandoGuardar ? 'Guardando...' : 'Publicar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
