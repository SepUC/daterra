import React from 'react';
import { Link } from 'react-router-dom';

import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

function NotFound() {
  return (
    <>
      <section id="header">
        <div className="inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '4em 2em', borderRadius: '15px', maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'left', paddingRight: '2em' }}>
            <span className="icon solid major fa-exclamation-triangle" style={{ color: '#444444', marginBottom: '1em', display: 'block' }}></span>
            <h1><strong style={{ color: '#444444' }}>Error 404</strong></h1>
            <p style={{ color: '#444444', fontSize: '1.2em' }}>Página no encontrada</p>
            <p style={{ color: '#444444' }}>Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
            
            <ul className="actions" style={{ marginTop: '2em' }}>
              <li><Link to="/" className="button primary">Volver al inicio</Link></li>
            </ul>
          </div>
          
          <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center', marginTop: '2em' }}>
            {/* Espacio reservado para la imagen */}
            <div style={{ width: '100%', minHeight: '300px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <p style={{ margin: 0 }}>[Espacio para Imagen]</p>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}

export default NotFound;