// src/middlewares/auth.middleware.js
// Cubre: tokens JWT, rutas protegidas, autenticación y autorización

import jwt from 'jsonwebtoken'

// Middleware: verifica que el token JWT sea válido
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token requerido.' })
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded // adjuntar datos del usuario a la request
    next()
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado.' })
  }
}

// Middleware: verifica que el usuario sea admin
export const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' })
  }
  next()
}

// Middleware: verifica que sea padre o admin
export const padreOAdmin = (req, res, next) => {
  if (!['padre', 'admin'].includes(req.usuario?.rol)) {
    return res.status(403).json({ mensaje: 'Acceso denegado.' })
  }
  next()
}
