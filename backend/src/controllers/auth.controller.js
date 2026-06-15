// src/controllers/auth.controller.js
// Cubre: sistema de autenticación y autorización, tokens JWT, bcrypt

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body

    // 1. Buscar usuario por correo
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ? AND activo = 1',
      [correo]
    )

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }

    const usuario = rows[0]

    // 2. Verificar contraseña con bcrypt
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' })
    }

    // 3. Generar token JWT
    const token = jwt.sign(
      {
        id:        usuario.id,
        nombre:    usuario.nombre,
        correo:    usuario.correo,
        rol:       usuario.rol,
        alumno_id: usuario.alumno_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    )

    // 4. Responder con token y datos del usuario (sin contraseña)
    const { contrasena: _, ...usuarioSinPass } = usuario
    return res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: usuarioSinPass,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
}

// POST /api/auth/registro
export const registro = async (req, res) => {
  try {
    const { nombre, correo, contrasena, nombre_alumno, fecha_nacimiento, curp } = req.body

    // Verificar si el correo ya existe
    const [existe] = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [correo])
    if (existe.length > 0) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' })
    }

    // Verificar CURP duplicado si se proporcionó
    if (curp) {
      const [curpExiste] = await pool.query('SELECT id FROM alumnos WHERE curp = ?', [curp])
      if (curpExiste.length > 0) {
        return res.status(409).json({ mensaje: 'El CURP ya está registrado' })
      }
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(contrasena, 10)

    // Crear alumno primero
    const [alumnoResult] = await pool.query(
      'INSERT INTO alumnos (nombre, curp, fecha_nacimiento, nombre_tutor) VALUES (?, ?, ?, ?)',
      [nombre_alumno, curp || null, fecha_nacimiento || null, nombre]
    )
    const alumnoId = alumnoResult.insertId

    // Crear usuario padre vinculado al alumno
    await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol, alumno_id) VALUES (?, ?, ?, "padre", ?)',
      [nombre, correo, hash, alumnoId]
    )

    return res.status(201).json({ mensaje: 'Usuario registrado exitosamente' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
}

// GET /api/auth/perfil — ruta protegida
export const perfil = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, correo, rol, alumno_id FROM usuarios WHERE id = ?',
      [req.usuario.id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' })
    }
    return res.status(200).json(rows[0])
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
}

// Actualizar nombre
export const actualizarPerfil = async (req, res) => {
  const { nombre } = req.body
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ mensaje: 'El nombre es requerido' })
  }
  try {
    await pool.query('UPDATE usuarios SET nombre = ? WHERE id = ?', [nombre.trim(), req.usuario.id])
    res.json({ mensaje: 'Nombre actualizado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' })
  }
}

// Cambiar contraseña
export const cambiarContrasena = async (req, res) => {
  const { contrasena_actual, contrasena_nueva } = req.body
  if (!contrasena_actual || !contrasena_nueva) {
    return res.status(400).json({ mensaje: 'Faltan datos' })
  }
  try {
    const [rows] = await pool.query('SELECT contrasena FROM usuarios WHERE id = ?', [req.usuario.id])
    const valida = await bcrypt.compare(contrasena_actual, rows[0].contrasena)
    if (!valida) return res.status(401).json({ mensaje: '❌ Contraseña actual incorrecta' })

    const hash = await bcrypt.hash(contrasena_nueva, 10)
    await pool.query('UPDATE usuarios SET contrasena = ? WHERE id = ?', [hash, req.usuario.id])
    res.json({ mensaje: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar la contraseña' })
  }
}