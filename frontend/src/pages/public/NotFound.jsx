// pages/public/NotFound.jsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  )
}
