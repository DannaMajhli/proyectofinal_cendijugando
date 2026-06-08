// src/routes/dashboard.routes.js
import { Router } from 'express'
import { obtenerStats } from '../controllers/otros.controller.js'
import { verificarToken, soloAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/stats', verificarToken, soloAdmin, obtenerStats)

export default router
