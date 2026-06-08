// pages/admin/PagosAdmin.jsx
import { useState } from 'react'
import { useAlumnos } from '../../hooks/index'
import { useFetch } from '../../hooks/index'
import { pagosService, alumnosService } from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { Modal } from '../../components/ui/index.jsx'

export default function PagosAdmin() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState({ alumno_id: '', mes_correspondiente: '', monto: '', concepto: 'Mensualidad' })
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })
  const [cargandoGuardar, setCargandoGuardar] = useState(false)

  const { data: pagosData, cargando, error } = useFetch(() => pagosService.listar(), [mensaje.texto])
  const { alumnos } = useAlumnos()

  const pagos = pagosData?.pagos || []

  const validar = () => {
    const e = {}
    if (!form.alumno_id) e.alumno_id = 'Selecciona un alumno'
    if (!form.mes_correspondiente.trim()) e.mes_correspondiente = 'Indica el mes'
    if (!form.monto || isNaN(form.monto) || Number(form.monto) <= 0) e.monto = 'Monto inválido'
    return e
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    const erroresVal = validar()
    if (Object.keys(erroresVal).length > 0) { setErrores(erroresVal); return }
    setCargandoGuardar(true)
    try {
      await pagosService.registrar(form)
      setMensaje({ tipo: 'success', texto: '✅ Pago registrado correctamente' })
      setModalAbierto(false)
      setForm({ alumno_id: '', mes_correspondiente: '', monto: '', concepto: 'Mensualidad' })
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.response?.data?.mensaje || '❌ Error al registrar pago' })
    } finally {
      setCargandoGuardar(false)
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
    }
  }

  return (
    <div className="page-container">
      <div className="flex-between mb-2">
        <h1 className="page-title">Control de Pagos</h1>
        <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>+ Registrar pago</button>
      </div>

      {mensaje.texto && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}

      {cargando ? <LoadingSpinner /> : error ? (
        <div className="alert alert-error">❌ {error}</div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Alumno</th><th>Mes</th><th>Concepto</th><th>Monto</th><th>Fecha</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {pagos.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.nombre_alumno}</strong></td>
                    <td>{p.mes_correspondiente}</td>
                    <td>{p.concepto}</td>
                    <td>${Number(p.monto).toLocaleString('es-MX')}</td>
                    <td>{new Date(p.fecha_pago).toLocaleDateString('es-MX')}</td>
                    <td>
                      <button className="btn btn-danger btn-sm"
                        onClick={async () => {
                          await pagosService.eliminar(p.id)
                          setMensaje({ tipo: 'success', texto: '✅ Pago eliminado' })
                          setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000)
                        }}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {pagos.length === 0 && <tr><td colSpan={6} className="text-center text-muted" style={{ padding: 24 }}>Sin pagos registrados</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal abierto={modalAbierto} titulo="Registrar pago" onClose={() => setModalAbierto(false)}>
        <div className="modal-body">
          <form id="form-pago" onSubmit={handleGuardar}>
            <div className="form-group">
              <label className="form-label">Alumno *</label>
              <select className={`form-control ${errores.alumno_id ? 'error' : ''}`}
                value={form.alumno_id} onChange={e => setForm(p => ({ ...p, alumno_id: e.target.value }))}>
                <option value="">Selecciona un alumno</option>
                {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
              {errores.alumno_id && <p className="form-error">{errores.alumno_id}</p>}
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Mes correspondiente *</label>
                <input type="text" className={`form-control ${errores.mes_correspondiente ? 'error' : ''}`}
                  value={form.mes_correspondiente} placeholder="Ej: Junio 2026"
                  onChange={e => setForm(p => ({ ...p, mes_correspondiente: e.target.value }))} />
                {errores.mes_correspondiente && <p className="form-error">{errores.mes_correspondiente}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Monto *</label>
                <input type="number" className={`form-control ${errores.monto ? 'error' : ''}`}
                  value={form.monto} placeholder="1500"
                  onChange={e => setForm(p => ({ ...p, monto: e.target.value }))} />
                {errores.monto && <p className="form-error">{errores.monto}</p>}
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
          <button type="submit" form="form-pago" className="btn btn-primary" disabled={cargandoGuardar}>
            {cargandoGuardar ? 'Guardando...' : 'Registrar pago'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
