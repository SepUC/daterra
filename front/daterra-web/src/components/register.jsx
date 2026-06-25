import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getUserTypeFromUser } from '../context/AuthContext';

import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

function Register() {
const [formData, setFormData] = useState({
    email: '',
    runUsuario: '',
    dvrunUsuario: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    direccion: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register, user, isAuthenticated } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      if (getUserTypeFromUser(user) === 2) {
        navigate('/mapCiudadano');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Forzamos a que el RUN se procese como número entero
    setFormData({
      ...formData,
      [name]: name === 'runUsuario' ? parseInt(value) || '' : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.primerNombre.trim() || !formData.email.trim() || !formData.primerApellido.trim()) {
      setError('Los campos obligatorios no pueden contener solo espacios vacíos.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Lógica de verificación de dominio de correo
      const domain = formData.email.includes('@') 
        ? formData.email.split('@')[1].toLowerCase() 
        : '';

      let computedComuna = 1;  // 1 = Santiago por defecto

      // Aquí puedes agregar un diccionario o más sentencias if para otros municipios
      if (domain === 'metropolitana.cl') {
        computedComuna = 1;  // Santiago (o el ID que represente la RM)
      } else if (domain === 'puentealto.cl') {
        computedComuna = 2;  // Puente Alto
      }

      // 2. Extraemos confirmPassword y ensamblamos el objeto final
      const { confirmPassword, ...datosBase } = formData;
      
      const datosParaEnviar = {
        ...datosBase,
        idComuna: computedComuna
      };

      // 3. Enviamos el objeto JSON plano directo al AuthContext
      await register(datosParaEnviar);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Error al registrar el usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <>
        <section id="header">
          <div className="inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: '3em 2em', borderRadius: '12px', maxWidth: '900px', margin: '0 auto' }}>
            <span className="icon solid major fa-user-plus" style={{ color: '#27ae60' }}></span>
            <h1><strong style={{ color: '#333' }}>Crear Cuenta Daterra</strong></h1>
            <p style={{ color: '#666', marginBottom: '2em' }}>Únete a nuestra comunidad y comienza a colaborar</p>

            <form onSubmit={handleSubmit}>
              {error && (
                  <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '1em', borderRadius: '8px', marginBottom: '2em', border: '1px solid #f5c6cb', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                    <span className="icon solid fa-exclamation-circle"></span>
                    {error}
                  </div>
              )}

              <div className="row gtr-uniform">
                {/* INFORMACIÓN DE CUENTA - Sección 1 */}
                <div className="col-12">
                  <h3 style={{ color: '#333', marginBottom: '1em', fontSize: '1.2em', borderBottom: '2px solid #27ae60', paddingBottom: '0.5em' }}>
                    <i className="fas fa-lock" style={{ marginRight: '0.5em', color: '#27ae60' }}></i>
                    Información de Cuenta
                  </h3>
                </div>

                <div className="col-12" style={{ marginBottom: '0.5em' }}>
                  <label htmlFor="email" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    Correo Electrónico <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' }}
                      required
                      disabled={isLoading}
                  />
                </div>

                <div className="col-6 col-12-small" style={{ marginBottom: '0.5em' }}>
                  <label htmlFor="password" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    Contraseña <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', paddingRight: '40px' }}
                        required
                        disabled={isLoading}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', zIndex: 10 }}
                    >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
                  </div>
                </div>

                <div className="col-6 col-12-small" style={{ marginBottom: '1.5em' }}>
                  <label htmlFor="confirmPassword" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    Confirmar Contraseña <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', paddingRight: '40px' }}
                        required
                        disabled={isLoading}
                    />
                    <span
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666', zIndex: 10 }}
                    >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
                  </div>
                </div>

                {/* INFORMACIÓN PERSONAL - Sección 2 */}
                <div className="col-12">
                  <h3 style={{ color: '#333', marginBottom: '1em', fontSize: '1.2em', borderBottom: '2px solid #3498db', paddingBottom: '0.5em' }}>
                    <i className="fas fa-id-card" style={{ marginRight: '0.5em', color: '#3498db' }}></i>
                    Información Personal
                  </h3>
                </div>

                <div className="col-12" style={{ marginBottom: '0.5em' }}>
                  <label htmlFor="primerNombre" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    Primer Nombre <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <input
                      type="text"
                      name="primerNombre"
                      id="primerNombre"
                      placeholder="Tu primer nombre"
                      value={formData.primerNombre}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' }}
                      required
                      disabled={isLoading}
                  />
                </div>

                <div className="col-12" style={{ marginBottom: '0.5em' }}>
                  <label htmlFor="segundoNombre" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    Segundo Nombre
                  </label>
                  <input
                      type="text"
                      name="segundoNombre"
                      id="segundoNombre"
                      placeholder="Tu segundo nombre (opcional)"
                      value={formData.segundoNombre}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' }}
                      disabled={isLoading}
                  />
                </div>

                <div className="col-6 col-12-small" style={{ marginBottom: '0.5em' }}>
                  <label htmlFor="primerApellido" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    Apellido Paterno <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <input
                      type="text"
                      name="primerApellido"
                      id="primerApellido"
                      placeholder="Apellido paterno"
                      value={formData.primerApellido}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' }}
                      required
                      disabled={isLoading}
                  />
                </div>

                <div className="col-6 col-12-small" style={{ marginBottom: '1.5em' }}>
                  <label htmlFor="segundoApellido" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    Apellido Materno
                  </label>
                  <input
                      type="text"
                      name="segundoApellido"
                      id="segundoApellido"
                      placeholder="Apellido materno (opcional)"
                      value={formData.segundoApellido}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' }}
                      disabled={isLoading}
                  />
                </div>

                {/* INFORMACIÓN DE IDENTIFICACIÓN - Sección 3 */}
                <div className="col-12">
                  <h3 style={{ color: '#333', marginBottom: '1em', fontSize: '1.2em', borderBottom: '2px solid #9b59b6', paddingBottom: '0.5em' }}>
                    <i className="fas fa-passport" style={{ marginRight: '0.5em', color: '#9b59b6' }}></i>
                    Identificación
                  </h3>
                </div>

                <div className="col-8 col-12-small" style={{ marginBottom: '0.5em' }}>
                  <label htmlFor="runUsuario" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    RUN <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <input
                      type="number"
                      name="runUsuario"
                      id="runUsuario"
                      placeholder="Sin puntos ni guión"
                      value={formData.runUsuario}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' }}
                      required
                      disabled={isLoading}
                  />
                </div>

                <div className="col-4 col-12-small" style={{ marginBottom: '1.5em' }}>
                  <label htmlFor="dvrunUsuario" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    DV <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <input
                      type="text"
                      name="dvrunUsuario"
                      id="dvrunUsuario"
                      placeholder="DV"
                      maxLength="1"
                      value={formData.dvrunUsuario}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' }}
                      required
                      disabled={isLoading}
                  />
                </div>

                {/* INFORMACIÓN DE CONTACTO - Sección 4 */}
                <div className="col-12">
                  <h3 style={{ color: '#333', marginBottom: '1em', fontSize: '1.2em', borderBottom: '2px solid #e67e22', paddingBottom: '0.5em' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5em', color: '#e67e22' }}></i>
                    Información de Contacto
                  </h3>
                </div>

                <div className="col-12" style={{ marginBottom: '0.5em' }}>
                  <label htmlFor="telefono" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    Teléfono
                  </label>
                  <input
                      type="tel"
                      name="telefono"
                      id="telefono"
                      placeholder="+56 9 XXXX XXXX"
                      value={formData.telefono}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' }}
                      disabled={isLoading}
                  />
                </div>

                <div className="col-12" style={{ marginBottom: '1.5em' }}>
                  <label htmlFor="direccion" style={{ display: 'block', color: '#555', fontWeight: '500', marginBottom: '0.3em', fontSize: '0.95em' }}>
                    Dirección
                  </label>
                  <input
                      type="text"
                      name="direccion"
                      id="direccion"
                      placeholder="Tu dirección completa"
                      value={formData.direccion}
                      onChange={handleChange}
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333' }}
                      disabled={isLoading}
                  />
                </div>



                {/* BOTÓN DE ENVÍO */}
                <div className="col-12">
                  <ul className="actions special">
                    <li>
                      <button type="submit" className="button primary large" disabled={isLoading}>
                        {isLoading ? (
                            <>
                              <span className="icon solid fa-spinner fa-spin" style={{ marginRight: '0.5em' }}></span>
                              Guardando en AWS RDS...
                            </>
                        ) : (
                            <>
                              <span className="icon solid fa-check" style={{ marginRight: '0.5em' }}></span>
                              Crear Cuenta
                            </>
                        )}
                      </button>
                    </li>
                  </ul>
                </div>

                {/* ENLACE DE INICIO DE SESIÓN */}
                <div className="col-12" style={{ textAlign: 'center', marginTop: '1em' }}>
                  <p style={{ color: '#666', fontSize: '0.95em' }}>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#27ae60', textDecoration: 'none', fontWeight: '500' }}>Inicia sesión aquí</Link>
                  </p>
                </div>
              </div>
            </form>

            {/* NOTA DE CAMPOS REQUERIDOS */}
            <div style={{ marginTop: '2em', padding: '1em', backgroundColor: 'rgba(52, 152, 219, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
              <p style={{ color: '#555', fontSize: '0.9em', margin: 0 }}>
                <strong>Nota:</strong> Los campos marcados con <span style={{ color: '#e74c3c' }}>*</span> son obligatorios. Los demás campos son opcionales.
              </p>
            </div>
          </div>
        </section>
      </>
  );
}

export default Register;
