// src/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { verificarConexion } from './config/db.js'
import authRoutes      from './routes/auth.routes.js'
import alumnosRoutes   from './routes/alumnos.routes.js'
import pagosRoutes     from './routes/pagos.routes.js'
import avisosRoutes    from './routes/avisos.routes.js'
import gruposRoutes    from './routes/grupos.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://proyectofinal-cendijugando.vercel.app',
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth',      authRoutes)
app.use('/api/alumnos',   alumnosRoutes)
app.use('/api/pagos',     pagosRoutes)
app.use('/api/avisos',    avisosRoutes)
app.use('/api/grupos',    gruposRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }))
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }))
app.use((err, req, res, next) => res.status(500).json({ mensaje: 'Error interno del servidor' }))

const iniciar = async () => {
  await verificarConexion()
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    console.log(`   POST /api/auth/login`)
    console.log(`   POST /api/auth/registro`)
    console.log(`   GET  /api/alumnos`)
    console.log(`   GET  /api/pagos`)
    console.log(`   GET  /api/avisos`)
    console.log(`   GET  /api/grupos`)
    console.log(`   GET  /api/dashboard/stats`)
  })
}

iniciar()
