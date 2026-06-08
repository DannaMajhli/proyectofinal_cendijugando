// src/routes/alumnos.routes.js
import { Router } from 'express'
import { body } from 'express-validator'
import { listarAlumnos, obtenerAlumno, crearAlumno, actualizarAlumno, eliminarAlumno } from '../controllers/alumnos.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'
import { validarCampos } from '../middlewares/validacion.middleware.js'

const router = Router()

// Todas las rutas de alumnos requieren token
router.use(verificarToken)

router.get('/',      listarAlumnos)                         // GET  /api/alumnos
router.get('/:id',   obtenerAlumno)                         // GET  /api/alumnos/:id
router.post('/', soloAdmin, [                               // POST /api/alumnos
  body('nombre').notEmpty().withMessage('Nombre requerido'),
  body('nombre_tutor').notEmpty().withMessage('Tutor requerido'),
  validarCampos
], crearAlumno)
router.put('/:id',    soloAdmin, actualizarAlumno)          // PUT  /api/alumnos/:id
router.delete('/:id', soloAdmin, eliminarAlumno)            // DEL  /api/alumnos/:id

export default router


// src/routes/pagos.routes.js
import { Router as PagosRouter } from 'express'
import { body as pagosBody } from 'express-validator'
import { listarPagos, listarPagosPorAlumno, registrarPago, eliminarPago } from '../controllers/otros.controller.js'

const pagosRouter = PagosRouter()
pagosRouter.use(verificarToken)

pagosRouter.get('/',                listarPagos)                        // GET /api/pagos
pagosRouter.get('/alumno/:alumnoId', listarPagosPorAlumno)              // GET /api/pagos/alumno/:id
pagosRouter.post('/', soloAdmin, [                                      // POST /api/pagos
  pagosBody('alumno_id').notEmpty().withMessage('Alumno requerido'),
  pagosBody('mes_correspondiente').notEmpty().withMessage('Mes requerido'),
  pagosBody('monto').isFloat({ gt: 0 }).withMessage('Monto inválido'),
  validarCampos
], registrarPago)
pagosRouter.delete('/:id', soloAdmin, eliminarPago)                     // DEL /api/pagos/:id

export { pagosRouter }


// src/routes/avisos.routes.js
import { Router as AvisosRouter } from 'express'
import { listarAvisos, listarAvisosPublicos, crearAviso, actualizarAviso, eliminarAviso } from '../controllers/otros.controller.js'

const avisosRouter = AvisosRouter()

avisosRouter.get('/publicos', listarAvisosPublicos)                     // GET /api/avisos/publicos (pública)
avisosRouter.get('/',         verificarToken, listarAvisos)             // GET /api/avisos
avisosRouter.post('/',        verificarToken, soloAdmin, crearAviso)    // POST /api/avisos
avisosRouter.put('/:id',      verificarToken, soloAdmin, actualizarAviso)
avisosRouter.delete('/:id',   verificarToken, soloAdmin, eliminarAviso)

export { avisosRouter }


// src/routes/grupos.routes.js
import { Router as GruposRouter } from 'express'
import { listarGrupos, crearGrupo, actualizarGrupo, eliminarGrupo } from '../controllers/otros.controller.js'

const gruposRouter = GruposRouter()
gruposRouter.use(verificarToken)

gruposRouter.get('/',      listarGrupos)
gruposRouter.post('/',     soloAdmin, crearGrupo)
gruposRouter.put('/:id',   soloAdmin, actualizarGrupo)
gruposRouter.delete('/:id',soloAdmin, eliminarGrupo)

export { gruposRouter }


// src/routes/dashboard.routes.js
import { Router as DashRouter } from 'express'
import { obtenerStats } from '../controllers/otros.controller.js'

const dashRouter = DashRouter()
dashRouter.get('/stats', verificarToken, soloAdmin, obtenerStats)

export { dashRouter }
