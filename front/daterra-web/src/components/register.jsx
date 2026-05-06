import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      console.log('Registro exitoso');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error en registro. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section id="header">
        <div className="inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '4em 2em', borderRadius: '15px', maxWidth: '600px', margin: '0 auto' }}>
          <span className="icon solid major fa-user-plus" style={{ color: '#444444' }}></span>
          <h1><strong style={{ color: '#444444' }}>Registro</strong></h1>
          <p style={{ color: '#444444' }}>Crea tu cuenta en Daterra</p>
          
          <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2em auto'}}>
            {error && (
              <div style={{ 
                backgroundColor: '#f8d7da', 
                color: '#721c24', 
                padding: '1em', 
                borderRadius: '8px', 
                marginBottom: '1.5em',
                border: '1px solid #f5c6cb'
              }}>
                ⚠️ {error}
              </div>
            )}
            
            <div className="row gtr-uniform">
              <div className="col-12" style={{ marginBottom: '1.5em' }}>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  placeholder="Nombre Completo" 
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }}
                  disabled={isLoading}
                  required 
                />
              </div>
              <div className="col-12" style={{ marginBottom: '1.5em' }}>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="Correo Electrónico" 
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
              <div className="col-12" style={{ marginBottom: '1.5em', height: '1em' }}>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="Contraseña" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }}
                  disabled={isLoading}
                  required 
                />
              </div>
              <div className="col-12" style={{ marginBottom: '2em', height: '1em' }}>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  id="confirmPassword" 
                  placeholder="Confirmar Contraseña" 
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }}
                  disabled={isLoading}
                  required 
                />
              </div>
              <div className="col-12">
                <ul className="actions special">
                  <li>
                    <button type="submit" className="button primary" disabled={isLoading}>
                      {isLoading ? 'Cargando...' : 'Registrarse'}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </form>

          <div style={{ marginTop: '3em' }}>
            <p style={{ color: '#444444' }}>¿Ya tienes una cuenta? <Link to="/login" style={{ color: '#444444', textDecoration: 'underline' }}>Inicia sesión aquí</Link></p>
          </div>

          <div style={{ marginTop: '2em', padding: '1em', backgroundColor: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px', borderLeft: '4px solid #4CAF50' }}>
            <p style={{ margin: '0', fontSize: '0.85em', color: '#555' }}>
              💡 <strong>Para testing:</strong> Usa el helper en la esquina inferior derecha para ver credenciales de prueba
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
