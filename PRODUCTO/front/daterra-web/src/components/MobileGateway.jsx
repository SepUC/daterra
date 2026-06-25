import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

function MobileGateway() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      {/* SECCIÓN PRINCIPAL: Derivación a Móvil */}
      <section id="header" style={{ padding: '6em 0 4em 0' }}>
        <div className="inner" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <span className="icon solid major fa-mobile-alt" style={{ color: '#daffe8', backgroundColor: '#ffffff00' }}></span>
          <h1>¡Tu cuenta de <strong>Ciudadano</strong> está lista!</h1>
          <p style={{ fontSize: '1.2em', lineHeight: '1.6em', marginTop: '1em' }}>
            Para reportar microbasurales, revisar los puntos limpios en tiempo real 
            y conectar con tu municipalidad, utiliza nuestra aplicación móvil oficial.
          </p>
        </div>
      </section>

      {/* SECCIÓN DE DESCARGAS (Estilo 1 Centrado) */}
      <section id="three" className="main style1 special">
        <div 
          style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', /* Fuerza a centrar todos los hijos horizontalmente */
            textAlign: 'center'
          }}
        >
          
          <header className="major" style={{ width: '100%!', marginBottom: '2.5em!', display: 'flex!', flexDirection: 'column!', alignItems: 'center!' }}>
            <h2 style={{ fontWeight: 'bold', marginBottom: '0.5em', width: '100%' }}>
              Descarga la app en tu teléfono Android.
            </h2>
          </header>

          <div className="row gtr-150 justify-content-center">
            {/* Tarjeta Android Ampliada */}
            <div 
              className="col-8 col-10-medium col-12-small" 
              style={{ 
                background: '#fff', 
                padding: '3.5em 2em', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
                margin: '1em',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <span className="fab fa-android" style={{ fontSize: '5em', color: '#3DDC84', marginBottom: '0.2em' }}></span>
              <h2 style={{ fontWeight: 'bold', marginBottom: '0.5em' }}>Descarga para Android</h2>
              <p style={{ fontSize: '1.1em', maxWidth: '85%', margin: '0 auto', color: '#666' }}>
                Lleva a <strong>Daterra</strong> en tu bolsillo. Disponible para smartphones Samsung, Xiaomi, Motorola y cualquier dispositivo con sistema operativo Android.
              </p>
              <ul className="actions special" style={{ marginTop: '2.5em' }}>
                <li>
                  <a href="#" className="button primary medium icon solid fa-download" style={{ padding: '0 2em' }}>
                    Descargar en Google Play
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Botón de salir / volver seguro */}
          <div style={{ marginTop: '4em' }}>
            <button onClick={handleLogout} className="button alt small">
              Cerrar Sesión / Volver al Inicio
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default MobileGateway;