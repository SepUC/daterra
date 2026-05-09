import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    runUsuario: '',
    dvrunUsuario: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    direccion: '',
    telefono: '',
    password: '',
    idTipoUsu: 2, // 2 = Comun (General)
    idComuna: 1,  // 1 = Santiago (Ajustar según tu DB)
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['idTipoUsu', 'runUsuario', 'idComuna'];

    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? parseInt(value) || '' : value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...datosParaEnviar } = formData;
      await register(datosParaEnviar);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Error al registrar el usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <section id="header">
        <div className="inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '3em', borderRadius: '15px', maxWidth: '700px', margin: '2em auto' }}>
          <h1 style={{ color: '#444' }}>Registro Daterra</h1>

          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: '1em' }}>⚠️ {error}</div>}

            <div className="row gtr-uniform">
              {/* RUN Y DV */}
              <div className="col-8"><input type="number" name="runUsuario" placeholder="RUN" onChange={handleChange} required /></div>
              <div className="col-4"><input type="text" name="dvrunUsuario" placeholder="DV" maxLength="1" onChange={handleChange} required /></div>

              {/* NOMBRES */}
              <div className="col-6"><input type="text" name="primerNombre" placeholder="Primer Nombre" onChange={handleChange} required /></div>
              <div className="col-6"><input type="text" name="segundoNombre" placeholder="Segundo Nombre" onChange={handleChange} /></div>

              {/* APELLIDOS */}
              <div className="col-6"><input type="text" name="primerApellido" placeholder="Apellido Paterno" onChange={handleChange} required /></div>
              <div className="col-6"><input type="text" name="segundoApellido" placeholder="Apellido Materno" onChange={handleChange} /></div>

              {/* CONTACTO */}
              <div className="col-12"><input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} /></div>
              <div className="col-12"><input type="text" name="telefono" placeholder="Teléfono (+569...)" onChange={handleChange} /></div>

              <div className="col-12"><input type="email" name="email" placeholder="Correo Electrónico" onChange={handleChange} required /></div>

              {/* SELECTORES */}
              <div className="col-6">
                <label style={{color: '#666', fontSize: '0.8em'}}>Tipo de Usuario</label>
                <select name="idTipoUsu" value={formData.idTipoUsu} onChange={handleChange}>
                  <option value={2}>General (Ciudadano)</option>
                  <option value={1}>Municipal (Comuna)</option>
                </select>
              </div>
              <div className="col-6">
                <label style={{color: '#666', fontSize: '0.8em'}}>Comuna</label>
                <select name="idComuna" value={formData.idComuna} onChange={handleChange}>
                  <option value={1}>Santiago</option>
                  <option value={2}>Puente Alto</option>
                </select>
              </div>

              {/* PASSWORD */}
              <div className="col-6"><input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required /></div>
              <div className="col-6"><input type="password" name="confirmPassword" placeholder="Confirmar" onChange={handleChange} required /></div>

              <div className="col-12">
                <button type="submit" className="button primary fit" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
  );
}

export default Register;