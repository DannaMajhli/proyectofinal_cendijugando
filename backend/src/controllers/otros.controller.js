// src/controllers/pagos.controller.js
import pool from '../config/db.js'

export const listarPagos = async (req, res) => {
  try {
    const [pagos] = await pool.query(`
      SELECT p.*, a.nombre AS nombre_alumno
      FROM pagos p
      JOIN alumnos a ON p.alumno_id = a.id
      ORDER BY p.fecha_pago DESC
    `)
    return res.status(200).json({ pagos })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al obtener pagos' })
  }
}

export const listarPagosPorAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params
    const [pagos] = await pool.query(
      'SELECT * FROM pagos WHERE alumno_id = ? ORDER BY fecha_pago DESC',
      [alumnoId]
    )
    return res.status(200).json(pagos)
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al obtener pagos' })
  }
}

export const registrarPago = async (req, res) => {
  try {
    const { alumno_id, mes_correspondiente, monto, concepto } = req.body

    // Verificar que el alumno existe
    const [alumno] = await pool.query('SELECT id FROM alumnos WHERE id = ?', [alumno_id])
    if (alumno.length === 0) {
      return res.status(404).json({ mensaje: 'Alumno no encontrado' })
    }

    // Verificar pago duplicado
    const [duplicado] = await pool.query(
      'SELECT id FROM pagos WHERE alumno_id = ? AND mes_correspondiente = ?',
      [alumno_id, mes_correspondiente]
    )
    if (duplicado.length > 0) {
      return res.status(409).json({ mensaje: 'Ya existe un pago registrado para ese mes' })
    }

    const [result] = await pool.query(
      'INSERT INTO pagos (alumno_id, mes_correspondiente, monto, concepto) VALUES (?, ?, ?, ?)',
      [alumno_id, mes_correspondiente, monto, concepto || 'Mensualidad']
    )
    return res.status(201).json({ mensaje: 'Pago registrado', id: result.insertId })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al registrar pago' })
  }
}

export const eliminarPago = async (req, res) => {
  try {
    const { id } = req.params
    const [existe] = await pool.query('SELECT id FROM pagos WHERE id = ?', [id])
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' })
    }
    await pool.query('DELETE FROM pagos WHERE id = ?', [id])
    return res.status(200).json({ mensaje: 'Pago eliminado' })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al eliminar pago' })
  }
}


// src/controllers/avisos.controller.js
export const listarAvisos = async (req, res) => {
  try {
    const [avisos] = await pool.query(
      'SELECT * FROM avisos ORDER BY fecha_publicacion DESC'
    )
    return res.status(200).json(avisos)
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al obtener avisos' })
  }
}

export const listarAvisosPublicos = async (req, res) => {
  try {
    const [avisos] = await pool.query(
      'SELECT * FROM avisos WHERE publico = 1 AND (fecha_vigencia IS NULL OR fecha_vigencia >= CURDATE()) ORDER BY fecha_publicacion DESC'
    )
    return res.status(200).json(avisos)
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al obtener avisos' })
  }
}

export const crearAviso = async (req, res) => {
  try {
    const { titulo, contenido, publico, fecha_vigencia } = req.body
    const [result] = await pool.query(
      'INSERT INTO avisos (titulo, contenido, publico, fecha_vigencia) VALUES (?, ?, ?, ?)',
      [titulo, contenido, publico ? 1 : 0, fecha_vigencia || null]
    )
    return res.status(201).json({ mensaje: 'Aviso publicado', id: result.insertId })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al crear aviso' })
  }
}

export const actualizarAviso = async (req, res) => {
  try {
    const { id } = req.params
    const { titulo, contenido, publico, fecha_vigencia } = req.body
    await pool.query(
      'UPDATE avisos SET titulo=?, contenido=?, publico=?, fecha_vigencia=? WHERE id=?',
      [titulo, contenido, publico ? 1 : 0, fecha_vigencia || null, id]
    )
    return res.status(200).json({ mensaje: 'Aviso actualizado' })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al actualizar aviso' })
  }
}

export const eliminarAviso = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM avisos WHERE id = ?', [id])
    return res.status(200).json({ mensaje: 'Aviso eliminado' })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al eliminar aviso' })
  }
}


// src/controllers/grupos.controller.js
export const listarGrupos = async (req, res) => {
  try {
    const [grupos] = await pool.query(`
      SELECT g.*, COUNT(a.id) AS total_alumnos
      FROM grupos g
      LEFT JOIN alumnos a ON a.grupo_id = g.id AND a.activo = 1
      GROUP BY g.id
      ORDER BY g.nombre
    `)
    return res.status(200).json(grupos)
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al obtener grupos' })
  }
}

export const crearGrupo = async (req, res) => {
  try {
    const { nombre, nivel } = req.body
    const [result] = await pool.query(
      'INSERT INTO grupos (nombre, nivel) VALUES (?, ?)',
      [nombre, nivel]
    )
    return res.status(201).json({ mensaje: 'Grupo creado', id: result.insertId })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al crear grupo' })
  }
}

export const actualizarGrupo = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, nivel } = req.body
    await pool.query('UPDATE grupos SET nombre=?, nivel=? WHERE id=?', [nombre, nivel, id])
    return res.status(200).json({ mensaje: 'Grupo actualizado' })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al actualizar grupo' })
  }
}

export const eliminarGrupo = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM grupos WHERE id = ?', [id])
    return res.status(200).json({ mensaje: 'Grupo eliminado' })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al eliminar grupo' })
  }
}


// src/controllers/dashboard.controller.js
export const obtenerStats = async (req, res) => {
  try {
    const [[{ totalAlumnos }]] = await pool.query('SELECT COUNT(*) AS totalAlumnos FROM alumnos WHERE activo = 1')
    const [[{ totalGrupos }]]  = await pool.query('SELECT COUNT(*) AS totalGrupos FROM grupos')
    const mesActual = new Date().toLocaleString('es-MX', { month: 'long', year: 'numeric' })
    const [[{ pagosMes }]]     = await pool.query(
      'SELECT COUNT(*) AS pagosMes FROM pagos WHERE MONTH(fecha_pago) = MONTH(NOW()) AND YEAR(fecha_pago) = YEAR(NOW())'
    )
    const [[{ pendientes }]]   = await pool.query(`
      SELECT COUNT(*) AS pendientes FROM alumnos a
      WHERE a.activo = 1 AND NOT EXISTS (
        SELECT 1 FROM pagos p
        WHERE p.alumno_id = a.id
        AND MONTH(p.fecha_pago) = MONTH(NOW())
        AND YEAR(p.fecha_pago) = YEAR(NOW())
      )
    `)
    return res.status(200).json({ totalAlumnos, totalGrupos, pagosMes, pendientes })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al obtener estadísticas' })
  }
}
