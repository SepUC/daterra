import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      // Llamamos a la función login del AuthContext
      // Pasamos el email y el password
      await login(email, password);
      console.log('Login exitoso');
      navigate('/dashboard');
    } catch (err) {
      // 3. Manejo de errores específicos (RUN no encontrado, contraseña mal, etc)
      setError(err.message || 'Credenciales inválidas. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <>
        <section id="header">
          <div className="inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '4em 2em', borderRadius: '15px', maxWidth: '600px', margin: '0 auto' }}>
            <span className="icon solid major fa-lock" style={{ color: '#444444' }}></span>
            <h1><strong style={{ color: '#444444' }}>Iniciar Sesión</strong></h1>
            <p style={{ color: '#444444' }}>Ingresa a tu cuenta de Daterra</p>

            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2em auto'}}>
              {error && (
                  <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '1em', borderRadius: '8px', marginBottom: '1.5em', border: '1px solid #f5c6cb' }}>
                    ⚠️ {error}
                  </div>
              )}

              <div className="row gtr-uniform">
                <div className="col-12" style={{ marginBottom: '1.5em' }}>
                  <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }}
                      disabled={isLoading}
                      required
                  />
                </div>
                <div className="col-12" style={{ marginBottom: '2em', height: '1.5em' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError('');
                        }}
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000', paddingRight: '40px' }}
                        disabled={isLoading}
                        required
                    />
                    <span 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', zIndex: 10 }}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <ul className="actions special">
                    <li>
                      <button type="submit" className="button primary" disabled={isLoading}>
                        {isLoading ? 'Cargando...' : 'Ingresar'}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </form>

            <div style={{ marginTop: '3em' }}>
              <p style={{ color: '#444444' }}>¿No tienes una cuenta? <Link to="/register" style={{ color: '#444444', textDecoration: 'underline' }}>Regístrate aquí</Link></p>
            </div>
          </div>
        </section>
      </>
  );
}

export default Login;