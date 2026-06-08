// src/routes/pagos.routes.js
import { Router } from 'express'
import { body } from 'express-validator'
import { listarPagos, listarPagosPorAlumno, registrarPago, eliminarPago } from '../controllers/otros.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'
import { validarCampos } from '../middlewares/validacion.middleware.js'

const router = Router()

router.use(verificarToken)

router.get('/',                 listarPagos)
router.get('/alumno/:alumnoId', listarPagosPorAlumno)
router.post('/', soloAdmin, [
  body('alumno_id').notEmpty().withMessage('Alumno requerido'),
  body('mes_correspondiente').notEmpty().withMessage('Mes requerido'),
  body('monto').isFloat({ gt: 0 }).withMessage('Monto inválido'),
  validarCampos
], registrarPago)
router.delete('/:id', soloAdmin, eliminarPago)

export default router
