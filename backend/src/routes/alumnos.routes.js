// src/routes/alumnos.routes.js
import { Router } from 'express'
import { body } from 'express-validator'
import { listarAlumnos, obtenerAlumno, crearAlumno, actualizarAlumno, eliminarAlumno } from '../controllers/alumnos.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'
import { validarCampos } from '../middlewares/validacion.middleware.js'

const router = Router()

router.use(verificarToken)

router.get('/',       listarAlumnos)
router.get('/:id',    obtenerAlumno)
router.post('/', soloAdmin, [
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  body('nombre_tutor').notEmpty().withMessage('Tutor requerido'),
  validarCampos
], crearAlumno)
router.put('/:id',    soloAdmin, actualizarAlumno)
router.delete('/:id', soloAdmin, eliminarAlumno)

export default router
