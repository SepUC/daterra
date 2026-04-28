import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de login va acá para recibir enviar datos al backend
    console.log('Login credentials:', { email, password });
  };

  return (
    <>
      <section id="header">
        <div className="inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '4em 2em', borderRadius: '15px', maxWidth: '600px', margin: '0 auto' }}>
          <span className="icon solid major fa-lock" style={{ color: '#444444' }}></span>
          <h1><strong style={{ color: '#444444' }}>Iniciar Sesión</strong></h1>
          <p style={{ color: '#444444' }}>Ingresa a tu cuenta de Daterra</p>
          
          <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2em auto'}}>
            <div className="row gtr-uniform">
              <div className="col-12" style={{ marginBottom: '1.5em' }}>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="Correo Electrónico" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }}
                  required 
                />
              </div>
              <div className="col-12" style={{ marginBottom: '2em', height: '1em' }}>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="Contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }}
                  required 
                />
              </div>
              <div className="col-12">
                <ul className="actions special">
                  <li><button type="submit" className="button primary">Ingresar</button></li>
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