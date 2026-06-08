// src/routes/grupos.routes.js
import { Router } from 'express'
import { listarGrupos, crearGrupo, actualizarGrupo, eliminarGrupo } from '../controllers/otros.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verificarToken)

router.get('/',       listarGrupos)
router.post('/',      soloAdmin, crearGrupo)
router.put('/:id',    soloAdmin, actualizarGrupo)
router.delete('/:id', soloAdmin, eliminarGrupo)

export default router
