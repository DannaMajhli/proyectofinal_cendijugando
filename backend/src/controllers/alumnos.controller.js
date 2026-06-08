// src/controllers/alumnos.controller.js
// Cubre: Altas, bajas, cambios y consultas a la BD mediante APIs

import pool from '../config/db.js'

// GET /api/alumnos — listar con búsqueda, filtro y paginación
export const listarAlumnos = async (req, res) => {
  try {
    const { busqueda = '', grupo = '', pagina = 1 } = req.query
    const limite = 10
    const offset = (parseInt(pagina) - 1) * limite

    let query = `
      SELECT a.*, g.nombre AS nombre_grupo, g.nivel AS nivel_grupo
      FROM alumnos a
      LEFT JOIN grupos g ON a.grupo_id = g.id
      WHERE a.activo = 1
    `
    const params = []

    if (busqueda) {
      query += ' AND (a.nombre LIKE ? OR a.curp LIKE ?)'
      params.push(`%${busqueda}%`, `%${busqueda}%`)
    }
    if (grupo) {
      query += ' AND g.nombre = ?'
      params.push(grupo)
    }

    // Contar total para paginación
    const [countRows] = await pool.query(
      query.replace('SELECT a.*, g.nombre AS nombre_grupo, g.nivel AS nivel_grupo', 'SELECT COUNT(*) AS total'),
      params
    )
    const total = countRows[0].total

    query += ' ORDER BY a.nombre ASC LIMIT ? OFFSET ?'
    params.push(limite, offset)

    const [alumnos] = await pool.query(query, params)

    return res.status(200).json({ alumnos, total, pagina: parseInt(pagina), limite })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ mensaje: 'Error al obtener alumnos' })
  }
}

// GET /api/alumnos/:id — obtener un alumno
export const obtenerAlumno = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await pool.query(`
      SELECT a.*, g.nombre AS nombre_grupo, g.nivel AS nivel_grupo
      FROM alumnos a
      LEFT JOIN grupos g ON a.grupo_id = g.id
      WHERE a.id = ?
    `, [id])

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Alumno no encontrado' })
    }
    return res.status(200).json(rows[0])
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al obtener alumno' })
  }
}

// POST /api/alumnos — ALTA
export const crearAlumno = async (req, res) => {
  try {
    const { nombre, curp, fecha_nacimiento, nombre_tutor, grupo_id } = req.body

    // Verificar CURP duplicado
    if (curp) {
      const [existe] = await pool.query('SELECT id FROM alumnos WHERE curp = ?', [curp])
      if (existe.length > 0) {
        return res.status(409).json({ mensaje: 'El CURP ya está registrado' })
      }
    }

    const [result] = await pool.query(
      'INSERT INTO alumnos (nombre, curp, fecha_nacimiento, nombre_tutor, grupo_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, curp || null, fecha_nacimiento || null, nombre_tutor, grupo_id || null]
    )

    return res.status(201).json({ mensaje: 'Alumno registrado', id: result.insertId })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ mensaje: 'Error al registrar alumno' })
  }
}

// PUT /api/alumnos/:id — CAMBIO
export const actualizarAlumno = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, curp, fecha_nacimiento, nombre_tutor, grupo_id } = req.body

    const [existe] = await pool.query('SELECT id FROM alumnos WHERE id = ?', [id])
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Alumno no encontrado' })
    }

    await pool.query(
      'UPDATE alumnos SET nombre=?, curp=?, fecha_nacimiento=?, nombre_tutor=?, grupo_id=? WHERE id=?',
      [nombre, curp || null, fecha_nacimiento || null, nombre_tutor, grupo_id || null, id]
    )

    return res.status(200).json({ mensaje: 'Alumno actualizado correctamente' })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al actualizar alumno' })
  }
}

// DELETE /api/alumnos/:id — BAJA (soft delete)
export const eliminarAlumno = async (req, res) => {
  try {
    const { id } = req.params

    const [existe] = await pool.query('SELECT id FROM alumnos WHERE id = ?', [id])
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Alumno no encontrado' })
    }

    // Soft delete: solo marca como inactivo
    await pool.query('UPDATE alumnos SET activo = 0 WHERE id = ?', [id])

    return res.status(200).json({ mensaje: 'Alumno eliminado correctamente' })
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error al eliminar alumno' })
  }
}
