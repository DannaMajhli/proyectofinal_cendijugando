import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { TemaProvider } from '../context/TemaContext'
import { NotificacionesProvider } from '../context/NotificacionesContext'
import Navbar from '../components/layout/Navbar'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Inicio         = lazy(() => import('../pages/public/Inicio'))
const Login          = lazy(() => import('../pages/public/Login'))
const Registro       = lazy(() => import('../pages/public/Registro'))
const NotFound       = lazy(() => import('../pages/public/NotFound'))
const DashboardPadre = lazy(() => import('../pages/padre/DashboardPadre'))
const AvisosPadre    = lazy(() => import('../pages/padre/AvisosPadre'))
const MiHijo         = lazy(() => import('../pages/padre/MiHijo'))
const PagosPadre     = lazy(() => import('../pages/padre/PagosPadre'))
const Perfil         = lazy(() => import('../pages/padre/Perfil'))
const DashboardAdmin = lazy(() => import('../pages/admin/DashboardAdmin'))
const Alumnos        = lazy(() => import('../pages/admin/Alumnos'))
const AlumnoDetalle  = lazy(() => import('../pages/admin/AlumnoDetalle'))
const PagosAdmin     = lazy(() => import('../pages/admin/PagosAdmin'))
const AvisosAdmin    = lazy(() => import('../pages/admin/AvisosAdmin'))
const GruposAdmin    = lazy(() => import('../pages/admin/GruposAdmin'))

function RutaProtegida({ children, rolRequerido }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <LoadingSpinner />
  if (!usuario) return <Navigate to="/login" replace />
  if (rolRequerido && usuario.rol !== rolRequerido) return <Navigate to="/" replace />
  return children
}

function Layout({ children }) {
  return <><Navbar /><main>{children}</main></>
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullscreen />}>
      <Routes>
        <Route path="/" element={<Layout><Inicio /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/padre" element={<RutaProtegida rolRequerido="padre"><Layout><DashboardPadre /></Layout></RutaProtegida>} />
        <Route path="/padre/avisos" element={<RutaProtegida rolRequerido="padre"><Layout><AvisosPadre /></Layout></RutaProtegida>} />
        <Route path="/padre/hijo/:id" element={<RutaProtegida rolRequerido="padre"><Layout><MiHijo /></Layout></RutaProtegida>} />
        <Route path="/padre/pagos" element={<RutaProtegida rolRequerido="padre"><Layout><PagosPadre /></Layout></RutaProtegida>} />
        <Route path="/padre/perfil" element={<RutaProtegida rolRequerido="padre"><Layout><Perfil /></Layout></RutaProtegida>} />
        <Route path="/admin" element={<RutaProtegida rolRequerido="admin"><Layout><DashboardAdmin /></Layout></RutaProtegida>} />
        <Route path="/admin/alumnos" element={<RutaProtegida rolRequerido="admin"><Layout><Alumnos /></Layout></RutaProtegida>} />
        <Route path="/admin/alumnos/:id" element={<RutaProtegida rolRequerido="admin"><Layout><AlumnoDetalle /></Layout></RutaProtegida>} />
        <Route path="/admin/pagos" element={<RutaProtegida rolRequerido="admin"><Layout><PagosAdmin /></Layout></RutaProtegida>} />
        <Route path="/admin/avisos" element={<RutaProtegida rolRequerido="admin"><Layout><AvisosAdmin /></Layout></RutaProtegida>} />
        <Route path="/admin/grupos" element={<RutaProtegida rolRequerido="admin"><Layout><GruposAdmin /></Layout></RutaProtegida>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <TemaProvider>
        <AuthProvider>
          <NotificacionesProvider>
            <AppRoutes />
          </NotificacionesProvider>
        </AuthProvider>
      </TemaProvider>
    </BrowserRouter>
  )
}
