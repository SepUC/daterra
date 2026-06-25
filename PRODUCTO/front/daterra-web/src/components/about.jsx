import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

function About() {
  // Opcional: Esto hace que al entrar a la página, el scroll vuelva arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* SECCIÓN CABECERA */}
      <section id="header">
        <div className="inner">
          <span className="icon solid major fa-leaf"></span>
          <h1>Conoce más sobre <strong>Daterra</strong></h1>
          <p>Nuestra misión es transformar la gestión de residuos<br />
          conectando a los ciudadanos con sus municipalidades.</p>
        </div>
      </section>

    {/* SECCIÓN 1: El problema / La motivación (Centrado forzado con Flexbox) */}
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
              El desafío de la gestión de residuos actual
            </h2>
          </header>
          
          <p style={{ fontSize: '1.1em', lineHeight: '1.6em', width: '100%' }}>
            Diariamente se generan toneladas de desechos que no son clasificados ni procesados adecuadamente. 
            Las municipalidades enfrentan el reto de gestionar estos recursos con información limitada, 
            mientras que los ciudadanos a menudo no saben cómo contribuir al proceso.
          </p>
          
          <p style={{ fontSize: '1.1em', lineHeight: '1.6em', width: '100%' }}>
            <strong>Daterra</strong> nace para cerrar esa brecha, ofreciendo una plataforma centralizada 
            donde la información fluye de manera transparente y colaborativa.
          </p>
          
        </div>
      </section>

      {/* SECCIÓN 2: Cómo funciona */}
      <section id="two" className="main style2">
        <div className="container">
          <div className="row gtr-150">
            <div className="col-6 col-12-medium">
              <ul className="major-icons">
                <li><span className="icon solid style1 major fa-mobile-alt"></span></li>
                <li><span className="icon solid style3 major fa-chart-line"></span></li>
              </ul>
            </div>
            <div className="col-6 col-12-medium">
              <header className="major">
                <h2>¿Cómo funciona nuestra plataforma?</h2>
              </header>
              <p>Para los <strong>ciudadanos</strong>, Daterra actúa como un mapa interactivo y un centro de información. Puedes localizar puntos limpios, reportar incidencias y ver el impacto de tu reciclaje.</p>
              <p>Para las <strong>municipalidades</strong>, funciona como un potente Dashboard administrativo. Permite visualizar métricas en tiempo real, rastrear la trazabilidad de los desechos declarados y optimizar las rutas y recursos de la comuna.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: Beneficios (Tres columnas) */}
      <section id="three" className="main style1 special">
        <div className="container">
          <header className="major" style={{ marginBottom: '2em' }}>
            <h1>El impacto de usar Daterra</h1>
          </header>
          <div className="row gtr-150">
            <div className="col-4 col-12-medium">
              <span className="icon solid fa-tree" style={{ fontSize: '4em', color: '#27ae60', marginBottom: '0.5em' }}></span>
              <h3>Medio Ambiente</h3>
              <p>Reducimos la huella de carbono al optimizar la recolección y fomentar la economía circular en cada comuna asociada.</p>
            </div>
            <div className="col-4 col-12-medium">
              <span className="icon solid fa-users" style={{ fontSize: '4em', color: '#3498db', marginBottom: '0.5em' }}></span>
              <h3>Comunidad Activa</h3>
              <p>Empoderamos a los vecinos dándoles las herramientas para ser actores principales en la limpieza de su entorno.</p>
            </div>
            <div className="col-4 col-12-medium">
              <span className="icon solid fa-chart-pie" style={{ fontSize: '4em', color: '#9b59b6', marginBottom: '0.5em' }}></span>
              <h3>Datos Precisos</h3>
              <p>Transformamos datos dispersos en reportes claros para la toma de decisiones estratégicas a nivel municipal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: Llamado a la acción */}
      <section id="four" className="main style2 special">
        <div className="container">
          <header className="major">
            <h1>¿Listo para ser parte del cambio?</h1>
            <p>Únete a nuestra plataforma y comienza a marcar la diferencia hoy mismo.</p>
          </header>
          <ul className="actions special">
            <li><Link to="/register" className="button wide primary">Crear mi cuenta gratis</Link></li>
            <li><Link to="/" className="button wide">Volver al inicio</Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default About;