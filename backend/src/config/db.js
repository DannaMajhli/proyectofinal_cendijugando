// src/config/db.js
// Conexión a MySQL — cubre: conexión a base de datos

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

// Pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'cendi_jugando',
  port:     parseInt(process.env.DB_PORT) || 3306,        
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false  
})

// Verificar conexión al iniciar
export const verificarConexion = async () => {
  try {
    const conn = await pool.getConnection()
    console.log('✅ Conexión a MySQL exitosa')
    conn.release()
  } catch (err) {
    console.error('❌ Error conectando a MySQL:', err.message)
    process.exit(1)
  }
}

export default pool
