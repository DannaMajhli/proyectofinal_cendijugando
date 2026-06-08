// components/layout/Navbar.jsx
// Cubre: NavLink, renderizado condicional, props, useAuth (estado global)

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PropTypes from 'prop-types'

// Componente auxiliar con children — cubre: uso de children
function NavGroup({ children }) {
  return <div className="navbar-links">{children}</div>
}
NavGroup.propTypes = { children: PropTypes.node.isRequired }

export default function Navbar() {
  const { usuario, logout, esAdmin, esPadre } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Iniciales para el avatar
  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span>🌟</span> Cendi Jugando
      </NavLink>

      <NavGroup>
        {/* Renderizado condicional según el rol */}
        {!usuario && (
          <>
            <NavLink to="/" end>Inicio</NavLink>
            <NavLink to="/login" className="btn-yellow">Iniciar sesión</NavLink>
            <NavLink to="/registro">Registrarse</NavLink>
          </>
        )}

        {esPadre && (
          <>
            <NavLink to="/padre">Dashboard</NavLink>
            <NavLink to="/padre/avisos">Avisos</NavLink>
            <NavLink to={`/padre/hijo/${usuario?.alumno_id}`}>Mi hijo</NavLink>
            <NavLink to="/padre/pagos">Pagos</NavLink>
          </>
        )}

        {esAdmin && (
          <>
            <NavLink to="/admin">Dashboard</NavLink>
            <NavLink to="/admin/alumnos">Alumnos</NavLink>
            <NavLink to="/admin/pagos">Pagos</NavLink>
            <NavLink to="/admin/avisos">Avisos</NavLink>
            <NavLink to="/admin/grupos">Grupos</NavLink>
          </>
        )}

        {usuario && (
          <div className="navbar-user">
            <div className="avatar">{iniciales}</div>
            <span>{usuario.nombre?.split(' ')[0]}</span>
            <button
              onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
            >
              Salir
            </button>
          </div>
        )}
      </NavGroup>
    </nav>
  )
}
