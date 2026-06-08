// src/routes/avisos.routes.js
import { Router } from 'express'
import { listarAvisos, listarAvisosPublicos, crearAviso, actualizarAviso, eliminarAviso } from '../controllers/otros.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/publicos', listarAvisosPublicos)
router.get('/',         verificarToken, listarAvisos)
router.post('/',        verificarToken, soloAdmin, crearAviso)
router.put('/:id',      verificarToken, soloAdmin, actualizarAviso)
router.delete('/:id',   verificarToken, soloAdmin, eliminarAviso)

export default router
