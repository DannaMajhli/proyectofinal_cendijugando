// pages/admin/FormularioAlumno.jsx
// Cubre: props, PropTypes, formulario controlado, validaciones, manejo de eventos

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { gruposService } from '../../services/api'

export default function FormularioAlumno({ alumno, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    nombre: '',
    curp: '',
    fecha_nacimiento: '',
    nombre_tutor: '',
    grupo_id: '',
  })
  const [errores, setErrores] = useState({})
  const [grupos, setGrupos] = useState([])
  const [cargando, setCargando] = useState(false)

  // useEffect — actualización: rellena el form cuando se edita un alumno
  useEffect(() => {
    if (alumno) {
      setForm({
        nombre: alumno.nombre || '',
        curp: alumno.curp || '',
        fecha_nacimiento: alumno.fecha_nacimiento?.split('T')[0] || '',
        nombre_tutor: alumno.nombre_tutor || '',
        grupo_id: alumno.grupo_id || '',
      })
    }
  }, [alumno]) // se ejecuta cuando cambia el prop alumno

  // useEffect — montaje: carga los grupos disponibles
  useEffect(() => {
    gruposService.listar()
      .then(res => setGrupos(res.data))
      .catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (form.curp && form.curp.length !== 18) e.curp = 'El CURP debe tener 18 caracteres'
    if (!form.nombre_tutor.trim()) e.nombre_tutor = 'El nombre del tutor es requerido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const erroresVal = validar()
    if (Object.keys(erroresVal).length > 0) { setErrores(erroresVal); return }
    setCargando(true)
    try {
      await onGuardar(form)
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <div className="modal-body">
        <form id="form-alumno" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Nombre completo *</label>
              <input type="text" name="nombre" className={`form-control ${errores.nombre ? 'error' : ''}`}
                value={form.nombre} onChange={handleChange} placeholder="Nombre del alumno" />
              {errores.nombre && <p className="form-error">{errores.nombre}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de nacimiento</label>
              <input type="date" name="fecha_nacimiento" className="form-control"
                value={form.fecha_nacimiento} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">CURP</label>
              <input type="text" name="curp" className={`form-control ${errores.curp ? 'error' : ''}`}
                value={form.curp} onChange={handleChange} placeholder="18 caracteres"
                maxLength={18} style={{ textTransform: 'uppercase' }} />
              {errores.curp && <p className="form-error">{errores.curp}</p>}
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Nombre del tutor *</label>
              <input type="text" name="nombre_tutor" className={`form-control ${errores.nombre_tutor ? 'error' : ''}`}
                value={form.nombre_tutor} onChange={handleChange} placeholder="Nombre completo del padre/tutor" />
              {errores.nombre_tutor && <p className="form-error">{errores.nombre_tutor}</p>}
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Grupo</label>
              <select name="grupo_id" className="form-control" value={form.grupo_id} onChange={handleChange}>
                <option value="">Sin grupo asignado</option>
                {grupos.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancelar}>Cancelar</button>
        <button type="submit" form="form-alumno" className="btn btn-primary" disabled={cargando}>
          {cargando ? 'Guardando...' : alumno ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </>
  )
}

// PropTypes — validación de propiedades del componente
FormularioAlumno.propTypes = {
  alumno: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    curp: PropTypes.string,
    fecha_nacimiento: PropTypes.string,
    nombre_tutor: PropTypes.string,
    grupo_id: PropTypes.number,
  }),
  onGuardar: PropTypes.func.isRequired,
  onCancelar: PropTypes.func.isRequired,
}

FormularioAlumno.defaultProps = {
  alumno: null,
}
