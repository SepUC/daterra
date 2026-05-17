import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Start from './components/start.jsx';
import Login from './components/login.jsx';
import Register from './components/register.jsx';
import Dashboard from './components/dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import TestCredentialsHelper from './components/TestCredentialsHelper.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
function AppContent() {
  const { user, isAuthenticated } = useAuth();

  return (
      <>
        <div className="App">
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">Daterra</Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
                  </li>
                  {!isAuthenticated && (
                      <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                      </li>
                  )}

                  {/* BOTÓN DEL MAPA LIBERADO: Visible siempre para desarrollo rápido */}
                  <li className="nav-item">
                    <Link className="nav-link" to="/map">Mapa de Puntos</Link>
                  </li>

                  {isAuthenticated && (
                      <>
                        <li className="nav-item">
                          <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                      <span style={{ marginLeft: '1em', color: '#666' }}>
                        👤 {user?.name}
                      </span>
                    </li>
                  </>
                )}
                <li class="nav-item">
                  <a class="nav-link" href="https://i.pinimg.com/736x/49/62/ee/4962ee8228258c179a707f7371a08d2b.jpg">El profe es terrible bacan</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link disabled" aria-disabled="true">Test boton deshabilitado</a>
                </li>
              </ul>
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
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>

        {/* Helper de credenciales en desarrollo */}
        <TestCredentialsHelper />
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
