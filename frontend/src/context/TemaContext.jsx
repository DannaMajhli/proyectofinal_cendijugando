// context/TemaContext.jsx
// Maneja el modo oscuro/claro con localStorage

import { createContext, useContext, useState, useEffect } from 'react'

const TemaContext = createContext(null)

export function TemaProvider({ children }) {
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem('tema') === 'oscuro'
  })

  // Aplicar clase al body cuando cambia el tema
  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add('dark')
      localStorage.setItem('tema', 'oscuro')
    } else {
      document.body.classList.remove('dark')
      localStorage.setItem('tema', 'claro')
    }
  }, [modoOscuro])

  const toggleTema = () => setModoOscuro(prev => !prev)

  return (
    <TemaContext.Provider value={{ modoOscuro, toggleTema }}>
      {children}
    </TemaContext.Provider>
  )
}

export function useTema() {
  const ctx = useContext(TemaContext)
  if (!ctx) throw new Error('useTema debe usarse dentro de TemaProvider')
  return ctx
}
