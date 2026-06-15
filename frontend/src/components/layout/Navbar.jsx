import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTema } from '../../context/TemaContext'
import Notificaciones from '../ui/Notificaciones'
import PropTypes from 'prop-types'

function NavGroup({ children }) {
  return <div className="navbar-links">{children}</div>
}
NavGroup.propTypes = { children: PropTypes.node.isRequired }

export default function Navbar() {
  const { usuario, logout, esAdmin, esPadre } = useAuth()
  const { modoOscuro, toggleTema } = useTema()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }
  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <img src="/CendiJugando.png" alt="Cendi Jugando"
          style={{ height: 36, width: 'auto', borderRadius: 6 }}
          onError={e => { e.target.style.display = 'none' }} />
        Cendi Jugando
      </NavLink>

      <NavGroup>
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
            <NavLink to="/padre/perfil">Perfil</NavLink>
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
        <button onClick={toggleTema} title={modoOscuro ? 'Modo claro' : 'Modo oscuro'}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
            padding: '6px 10px', cursor: 'pointer', fontSize: 18 }}>
          {modoOscuro ? '☀️' : '🌙'}
        </button>
        {usuario && <Notificaciones />}
        {usuario && (
          <div className="navbar-user">
            <div className="avatar">{iniciales}</div>
            <span>{usuario.nombre?.split(' ')[0]}</span>
            <button onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              Salir
            </button>
          </div>
        )}
      </NavGroup>
    </nav>
  )
}
