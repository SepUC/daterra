import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Start from './components/start.jsx';
import Login from './components/login.jsx';
import Register from './components/register.jsx';
import Dashboard from './components/dashboard.jsx';
import MapCiudadano from './components/mapCiudadano.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
      <>
        <div className="App">
          <nav style={{ backgroundColor: '#ffffff', padding: '1em 0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontFamily: 'Source Sans Pro, sans-serif', borderBottom: '3px solid #4c785c' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '2em', paddingRight: '2em', maxWidth: '1400px', margin: '0 auto' }}>
              <Link to="/" style={{ color: '#2e354f', textDecoration: 'none', fontSize: '1.5em', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                <span style={{ fontSize: '1.2em' }}>♻️</span> Daterra
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2.5em' }}>
                <Link to="/" style={{ color: '#2e354f', textDecoration: 'none', fontSize: '0.95em', transition: 'all 0.2s', padding: '0.5em 0', fontWeight: '500' }} onMouseEnter={e => { e.target.style.color = '#4c785c'; e.target.style.fontWeight = 'bold'; }} onMouseLeave={e => { e.target.style.color = '#2e354f'; e.target.style.fontWeight = '500'; }}>Inicio</Link>
                {isAuthenticated ? (
                  <>
                    {user?.idTipoUsu === 2 ? (
                      <Link to="/mapCiudadano" style={{ color: '#2e354f', textDecoration: 'none', fontSize: '0.95em', transition: 'all 0.2s', padding: '0.5em 0', fontWeight: '500' }} onMouseEnter={e => { e.target.style.color = '#4c785c'; e.target.style.fontWeight = 'bold'; }} onMouseLeave={e => { e.target.style.color = '#2e354f'; e.target.style.fontWeight = '500'; }}>Mapa de Puntos</Link>
                    ) : (
                      <Link to="/dashboard" style={{ color: '#2e354f', textDecoration: 'none', fontSize: '0.95em', transition: 'all 0.2s', padding: '0.5em 0', fontWeight: '500' }} onMouseEnter={e => { e.target.style.color = '#4c785c'; e.target.style.fontWeight = 'bold'; }} onMouseLeave={e => { e.target.style.color = '#2e354f'; e.target.style.fontWeight = '500'; }}>Dashboard</Link>
                    )}
                    <span style={{ color: '#666', fontSize: '0.9em', fontWeight: '500' }}>👤 {user?.name}</span>
                    <button onClick={logout} style={{ background: 'none', border: '2px solid #FF6B6B', color: '#FF6B6B', cursor: 'pointer', fontSize: '0.9em', fontWeight: '600', transition: 'all 0.2s', padding: '0.5em 1em', borderRadius: '6px', fontFamily: 'Source Sans Pro, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '2.4em' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FF6B6B'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FF6B6B'; }}>Cerrar Sesión</button>
                  </>
                ) : (
                  <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.95em', transition: 'all 0.2s', padding: '0.7em 1.5em', backgroundColor: '#4c785c', borderRadius: '6px', fontWeight: '600' }} onMouseEnter={e => e.target.style.backgroundColor = '#3d6049'} onMouseLeave={e => e.target.style.backgroundColor = '#4c785c'}>Iniciar Sesión</Link>
                )}
              </div>
            </div>
          </nav>
        </div>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/*<Route path="*" element={<NotFound />} /> */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} user={user} requiredUserType={1}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mapCiudadano"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} user={user} requiredUserType={2}>
                <MapCiudadano />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Helper de credenciales en desarrollo */}
        {/* <TestCredentialsHelper /> */}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <footer class="bg-light text-center text-lg-start">
          <div class="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            © 2026 Copyright:
            <a class="text-dark" href="https://m.media-amazon.com/images/I/61XmTyKs7sL.jpg">Daterra.com</a>
          </div>
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App
