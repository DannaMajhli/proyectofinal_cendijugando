import PropTypes from 'prop-types'

export default function LoadingSpinner({ fullscreen = false }) {
  if (fullscreen) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }
  return (
    <div className="loading-container">
      <div className="spinner" />
    </div>
  )
}
LoadingSpinner.propTypes = { fullscreen: PropTypes.bool }
