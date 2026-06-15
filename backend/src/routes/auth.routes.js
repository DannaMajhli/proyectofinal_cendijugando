// src/routes/auth.routes.js
import { Router } from 'express'
import { body } from 'express-validator'
import { login, registro, perfil, actualizarPerfil, cambiarContrasena } from '../controllers/auth.controller.js'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { validarCampos } from '../middlewares/validacion.middleware.js'

const router = Router()

// POST /api/auth/login
router.post('/login', [
  body('correo').isEmail().withMessage('Correo inválido'),
  body('contrasena').notEmpty().withMessage('Contraseña requerida'),
  validarCampos
], login)

// POST /api/auth/registro
router.post('/registro', [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  body('correo').isEmail().withMessage('Correo inválido'),
  body('contrasena').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  body('nombre_alumno').notEmpty().withMessage('Nombre del alumno requerido'),
  validarCampos
], registro)

// GET /api/auth/perfil — ruta protegida
router.get('/perfil', verificarToken, perfil)
router.put('/perfil', verificarToken, actualizarPerfil)
router.put('/cambiar-contrasena', verificarToken, cambiarContrasena)

export default router
