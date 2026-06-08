// src/middlewares/validacion.middleware.js
// Cubre: validaciones del lado del backend, códigos HTTP adecuados

import { validationResult } from 'express-validator'

// Middleware que revisa los resultados de express-validator
export const validarCampos = (req, res, next) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    // 422 Unprocessable Entity — datos inválidos
    return res.status(422).json({
      mensaje: 'Datos inválidos',
      errores: errores.array().map(e => ({ campo: e.path, mensaje: e.msg }))
    })
  }
  next()
}
