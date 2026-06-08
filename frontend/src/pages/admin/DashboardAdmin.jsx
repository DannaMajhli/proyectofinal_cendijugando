// pages/admin/DashboardAdmin.jsx
// Cubre: useEffect montaje, async/await, estado de carga, renderizado condicional

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function DashboardAdmin() {
  const { usuario } = useAuth()
  const [stats, setStats] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // useEffect — montaje: carga las estadísticas al entrar al dashboard
  useEffect(() => {
    const cargarStats = async () => {
      try {
        const res = await api.get('/dashboard/stats')
        setStats(res.data)
      } catch {
        setError('No se pudieron cargar las estadísticas')
      } finally {
        setCargando(false)
      }
    }
    cargarStats()
  }, []) // [] = solo al montar

  if (cargando) return <LoadingSpinner />

  return (
    <div className="page-container">
      <div className="flex-between mb-2">
        <h1 className="page-title">Dashboard — Administrador</h1>
        <span className="text-muted" style={{ fontSize: 13 }}>Hola, {usuario?.nombre} 👋</span>
      </div>

      {error && <div className="alert alert-error">❌ {error}</div>}

      {/* Renderizado condicional: muestra stats cuando ya cargaron */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total alumnos</p>
            <p className="stat-value stat-blue">{stats.totalAlumnos}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Grupos activos</p>
            <p className="stat-value stat-blue">{stats.totalGrupos}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Pagos este mes</p>
            <p className="stat-value stat-green">{stats.pagosMes}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Pagos pendientes</p>
            <p className="stat-value stat-orange">{stats.pendientes}</p>
          </div>
        </div>
      )}

      {/* Accesos rápidos */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">👤 Gestión de alumnos</h3>
            <Link to="/admin/alumnos" className="btn btn-primary btn-sm">Ver todos</Link>
          </div>
          <p className="text-muted" style={{ fontSize: 13 }}>Alta, baja, cambios y consultas de alumnos inscritos.</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">💰 Control de pagos</h3>
            <Link to="/admin/pagos" className="btn btn-primary btn-sm">Ver pagos</Link>
          </div>
          <p className="text-muted" style={{ fontSize: 13 }}>Registro y consulta de mensualidades.</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📢 Avisos</h3>
            <Link to="/admin/avisos" className="btn btn-primary btn-sm">Gestionar</Link>
          </div>
          <p className="text-muted" style={{ fontSize: 13 }}>Publicar y administrar comunicados para padres.</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🏫 Grupos</h3>
            <Link to="/admin/grupos" className="btn btn-primary btn-sm">Gestionar</Link>
          </div>
          <p className="text-muted" style={{ fontSize: 13 }}>Crear y organizar grupos por nivel.</p>
        </div>
      </div>
    </div>
  )
}
