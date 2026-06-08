// router/AppRouter.jsx
// Routing completo — cubre: lazy loading, rutas protegidas, 404, rutas anidadas, parámetros, query params

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// ── Lazy Loading: las páginas se cargan bajo demanda ──
const Inicio = lazy(() => import('../pages/public/Inicio'))
const Login = lazy(() => import('../pages/public/Login'))
const Registro = lazy(() => import('../pages/public/Registro'))
const NotFound = lazy(() => import('../pages/public/NotFound'))

// Páginas del padre (lazy)
const DashboardPadre = lazy(() => import('../pages/padre/DashboardPadre'))
const AvisosPadre = lazy(() => import('../pages/padre/AvisosPadre'))
const MiHijo = lazy(() => import('../pages/padre/MiHijo'))
const PagosPadre = lazy(() => import('../pages/padre/PagosPadre'))

// Páginas del admin (lazy)
const DashboardAdmin = lazy(() => import('../pages/admin/DashboardAdmin'))
const Alumnos = lazy(() => import('../pages/admin/Alumnos'))
const AlumnoDetalle = lazy(() => import('../pages/admin/AlumnoDetalle'))
const PagosAdmin = lazy(() => import('../pages/admin/PagosAdmin'))
const AvisosAdmin = lazy(() => import('../pages/admin/AvisosAdmin'))
const GruposAdmin = lazy(() => import('../pages/admin/GruposAdmin'))

// ── Ruta protegida genérica ──
function RutaProtegida({ children, rolRequerido }) {
  const { usuario, cargando } = useAuth()

  if (cargando) return <LoadingSpinner />
  if (!usuario) return <Navigate to="/login" replace />
  if (rolRequerido && usuario.rol !== rolRequerido) return <Navigate to="/" replace />

  return children
}

// ── Layout con Navbar ──
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Suspense muestra spinner mientras carga el lazy component */}
        <Suspense fallback={<LoadingSpinner fullscreen />}>
          <Routes>
            {/* ── Rutas públicas ── */}
            <Route path="/" element={<Layout><Inicio /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* ── Rutas del padre (protegidas, rol: padre) ── */}
            <Route
              path="/padre"
              element={
                <RutaProtegida rolRequerido="padre">
                  <Layout><DashboardPadre /></Layout>
                </RutaProtegida>
              }
            />
            {/* Rutas anidadas del padre */}
            <Route
              path="/padre/avisos"
              element={
                <RutaProtegida rolRequerido="padre">
                  <Layout><AvisosPadre /></Layout>
                </RutaProtegida>
              }
            />
            {/* Ruta con parámetro :id */}
            <Route
              path="/padre/hijo/:id"
              element={
                <RutaProtegida rolRequerido="padre">
                  <Layout><MiHijo /></Layout>
                </RutaProtegida>
              }
            />
            {/* Query params: /padre/pagos?mes=junio&anio=2026 */}
            <Route
              path="/padre/pagos"
              element={
                <RutaProtegida rolRequerido="padre">
                  <Layout><PagosPadre /></Layout>
                </RutaProtegida>
              }
            />

            {/* ── Rutas del admin (protegidas, rol: admin) ── */}
            <Route
              path="/admin"
              element={
                <RutaProtegida rolRequerido="admin">
                  <Layout><DashboardAdmin /></Layout>
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/alumnos"
              element={
                <RutaProtegida rolRequerido="admin">
                  <Layout><Alumnos /></Layout>
                </RutaProtegida>
              }
            />
            {/* Ruta con parámetro: detalle de alumno */}
            <Route
              path="/admin/alumnos/:id"
              element={
                <RutaProtegida rolRequerido="admin">
                  <Layout><AlumnoDetalle /></Layout>
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/pagos"
              element={
                <RutaProtegida rolRequerido="admin">
                  <Layout><PagosAdmin /></Layout>
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/avisos"
              element={
                <RutaProtegida rolRequerido="admin">
                  <Layout><AvisosAdmin /></Layout>
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/grupos"
              element={
                <RutaProtegida rolRequerido="admin">
                  <Layout><GruposAdmin /></Layout>
                </RutaProtegida>
              }
            />

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
