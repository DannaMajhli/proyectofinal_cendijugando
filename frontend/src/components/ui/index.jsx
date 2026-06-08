import PropTypes from 'prop-types'

// Alert — mensajes de éxito/error (no alertas del navegador)
export function Alert({ tipo = 'info', mensaje, onClose }) {
  if (!mensaje) return null
  const iconos = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }
  return (
    <div className={`alert alert-${tipo}`}>
      <span>{iconos[tipo]}</span>
      <span style={{ flex: 1 }}>{mensaje}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>×</button>
      )}
    </div>
  )
}
Alert.propTypes = {
  tipo: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  mensaje: PropTypes.string,
  onClose: PropTypes.func,
}

// Modal
export function Modal({ abierto, titulo, children, onClose }) {
  if (!abierto) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{titulo}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
Modal.propTypes = {
  abierto: PropTypes.bool.isRequired,
  titulo: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
}

// Badge
export function Badge({ texto, tipo = 'info' }) {
  return <span className={`badge badge-${tipo}`}>{texto}</span>
}
Badge.propTypes = {
  texto: PropTypes.string.isRequired,
  tipo: PropTypes.oneOf(['success', 'warning', 'danger', 'info']),
}