import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Menu, LogOut, MapPin, Trash2, Navigation, AlertCircle } from 'lucide-react';
import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

// Mock data para estadísticas de desechos reciclados
const monthlyWasteData = [
  { month: 'Enero', reciclado: 120, organico: 80, plastico: 45 },
  { month: 'Febrero', reciclado: 140, organico: 95, plastico: 55 },
  { month: 'Marzo', reciclado: 130, organico: 85, plastico: 50 },
  { month: 'Abril', reciclado: 160, organico: 110, plastico: 65 },
  { month: 'Mayo', reciclado: 180, organico: 125, plastico: 70 },
];

const wasteTypeData = [
  { name: 'Plástico', value: 35, kg: 850 },
  { name: 'Papel', value: 28, kg: 680 },
  { name: 'Metal', value: 20, kg: 480 },
  { name: 'Vidrio', value: 12, kg: 290 },
  { name: 'Otros', value: 5, kg: 120 },
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

function MapCiudadano() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recyclePoints, setRecyclePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: -33.4405632, lng: -70.6614779 });
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [distance, setDistance] = useState(20);

  // Obtener coordenadas del usuario y cargar puntos de reciclaje
  useEffect(() => {
    const fetchRecyclePoints = async () => {
      try {
        setLoading(true);
        // Intentar obtener la ubicación del usuario
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ lat: latitude, lng: longitude });
              await loadRecyclePoints(latitude, longitude, distance);
            },
            () => {
              // Si falla, usar las coordenadas por defecto (Santiago)
              loadRecyclePoints(userLocation.lat, userLocation.lng, distance);
            }
          );
        } else {
          await loadRecyclePoints(userLocation.lat, userLocation.lng, distance);
        }
      } catch (err) {
        setError('Error al cargar puntos de reciclaje');
        console.error(err);
        setLoading(false);
      }
    };

    fetchRecyclePoints();
  }, []);

  const loadRecyclePoints = async (lat, lng, dist) => {
    try {
      const response = await fetch(
        `https://puntoslimpios.mma.gob.cl/api/points/geo?lat=${lat}&lng=${lng}&distance=${dist}`
      );
      const data = await response.json();
      setRecyclePoints(data.features || []);
      setError(null);
    } catch (err) {
      setError('Error al conectar con el servidor de puntos de reciclaje');
      console.error(err);
      setRecyclePoints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error en logout:', err);
      navigate('/login');
    }
  };

  const handleSearchByDistance = () => {
    loadRecyclePoints(userLocation.lat, userLocation.lng, distance);
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radio de la tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '280px' : '80px',
          backgroundColor: 'rgba(50, 60, 90, 0.95)',
          color: '#fff',
          padding: '2em 1em',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2em',
            paddingBottom: '1.5em',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {sidebarOpen && (
            <h2 style={{ margin: 0, fontSize: '1.5em', fontWeight: 'bold' }}>
              <Trash2 size={24} style={{ display: 'inline', marginRight: '0.5em' }} />
              Daterra
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1.5em',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Navegación */}
        <nav style={{ marginBottom: '3em' }}>
          <div
            style={{
              padding: '1em',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              marginBottom: '1em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75em',
              transition: 'backgroundColor 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            <MapPin size={20} />
            {sidebarOpen && <span>Mapa de Puntos</span>}
          </div>
        </nav>

        {/* Usuario */}
        <div
          style={{
            position: 'absolute',
            bottom: '2em',
            left: '1em',
            right: '1em',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '1.5em',
          }}
        >
          {sidebarOpen && (
            <div style={{ marginBottom: '1.5em' }}>
              <p style={{ margin: '0 0 0.5em 0', fontSize: '0.9em', opacity: 0.8 }}>Conectado como</p>
              <p style={{ margin: 0, fontWeight: 'bold', wordBreak: 'break-word' }}>{user.name}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75em',
              backgroundColor: '#FF6B6B',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5em',
              transition: 'backgroundColor 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e85555')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FF6B6B')}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main
        style={{
          marginLeft: sidebarOpen ? '280px' : '80px',
          flex: 1,
          padding: '2em',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Header */}
        <section style={{ marginBottom: '2em' }}>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '2em',
              borderRadius: '15px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <h1
              style={{
                margin: 0,
                color: '#323C5A',
                fontSize: '2.5em',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5em',
              }}
            >
              <MapPin size={32} style={{ color: '#4ECDC4' }} />
              Puntos de Reciclaje Cerca de Ti
            </h1>
            <p style={{ margin: '0.5em 0 0 0', color: '#666' }}>Encuentra los centros de reciclaje más cercanos a tu ubicación</p>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2em', marginBottom: '2em' }}>
          {/* Panel de Búsqueda y Mapa */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2em',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              gridColumn: '1 / -1',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1em', marginBottom: '1.5em' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 'bold', color: '#333' }}>
                  Latitud
                </label>
                <input
                  type="number"
                  value={userLocation.lat}
                  onChange={(e) => setUserLocation({ ...userLocation, lat: parseFloat(e.target.value) })}
                  step="0.0001"
                  style={{
                    width: '100%',
                    padding: '0.75em',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 'bold', color: '#333' }}>
                  Longitud
                </label>
                <input
                  type="number"
                  value={userLocation.lng}
                  onChange={(e) => setUserLocation({ ...userLocation, lng: parseFloat(e.target.value) })}
                  step="0.0001"
                  style={{
                    width: '100%',
                    padding: '0.75em',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5em', fontWeight: 'bold', color: '#333' }}>
                  Distancia (km)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(parseFloat(e.target.value))}
                  min="1"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '0.75em',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                  }}
                />
              </div>
            </div>
            <button
              onClick={handleSearchByDistance}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75em',
                backgroundColor: '#4ECDC4',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '1em',
                transition: 'backgroundColor 0.2s',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#3ab5b0';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#4ECDC4';
              }}
            >
              <Navigation size={18} style={{ display: 'inline', marginRight: '0.5em' }} />
              {loading ? 'Buscando...' : 'Buscar Puntos'}
            </button>

            {error && (
              <div
                style={{
                  marginTop: '1em',
                  backgroundColor: '#fee',
                  padding: '1em',
                  borderRadius: '8px',
                  color: '#c33',
                  display: 'flex',
                  gap: '0.5em',
                }}
              >
                <AlertCircle size={20} style={{ marginTop: '0.2em' }} />
                {error}
              </div>
            )}
          </div>

          {/* Mapa Simple */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2em',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              gridColumn: '1 / -1',
            }}
          >
            <h2 style={{ margin: '0 0 1.5em 0', color: '#323C5A', fontSize: '1.3em', fontWeight: 'bold' }}>
              <MapPin size={24} style={{ display: 'inline', marginRight: '0.5em' }} />
              Mapa de Puntos de Reciclaje
            </h2>

            <div
              style={{
                width: '100%',
                height: '500px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5em',
                border: '2px solid #e0e0e0',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Grid Background */}
              <svg
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                }}
              >
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e0e0" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Puntos de reciclaje */}
              <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                {/* Punto del usuario */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#FF6B6B',
                      borderRadius: '50%',
                      border: '3px solid #fff',
                      boxShadow: '0 0 0 3px #FF6B6B',
                      cursor: 'pointer',
                    }}
                    title="Tu ubicación"
                  />
                </div>

                {/* Puntos de reciclaje */}
                {recyclePoints.length > 0 ? (
                  recyclePoints.map((point, idx) => {
                    const geometry = point.geometry?.coordinates;
                    if (!geometry) return null;

                    const [lng, lat] = geometry;
                    const latDiff = (lat - userLocation.lat) * 111; // ~111 km por grado
                    const lngDiff = (lng - userLocation.lng) * 111 * Math.cos((userLocation.lat * Math.PI) / 180);

                    const scale = 150; // pixels per km
                    const x = 50 + (lngDiff / distance) * scale / 2;
                    const y = 50 - (latDiff / distance) * scale / 2;

                    if (x < 0 || x > 100 || y < 0 || y > 100) return null;

                    return (
                      <div
                        key={idx}
                        style={{
                          position: 'absolute',
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: selectedPoint?.id === point.id ? 20 : 5,
                        }}
                        onClick={() => setSelectedPoint(point)}
                      >
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#4ECDC4',
                            borderRadius: '50%',
                            border: '3px solid #fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            transform: selectedPoint?.id === point.id ? 'scale(1.3)' : 'scale(1)',
                          }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                    }}
                  >
                    {loading ? 'Cargando puntos...' : 'No hay puntos de reciclaje en esta área'}
                  </div>
                )}
              </div>
            </div>

            {/* Leyenda del mapa */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5em', marginTop: '1.5em' }}>
              <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#FF6B6B',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 3px #FF6B6B',
                  }}
                />
                <span style={{ color: '#666' }}>Tu ubicación</span>
              </div>
              <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#4ECDC4',
                    borderRadius: '50%',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                />
                <span style={{ color: '#666' }}>Puntos de reciclaje</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del Punto Seleccionado */}
        {selectedPoint && (
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2em',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '2em',
              borderLeft: '5px solid #4ECDC4',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5em 0', color: '#323C5A', fontSize: '1.3em' }}>
                  {selectedPoint.properties?.name || 'Punto de Reciclaje'}
                </h3>
                <p style={{ margin: '0.5em 0', color: '#666' }}>
                  <strong>Dirección:</strong> {selectedPoint.properties?.address || 'No disponible'}
                </p>
                {selectedPoint.geometry?.coordinates && (
                  <p style={{ margin: '0.5em 0', color: '#666' }}>
                    <strong>Distancia:</strong>{' '}
                    {calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      selectedPoint.geometry.coordinates[1],
                      selectedPoint.geometry.coordinates[0]
                    )}{' '}
                    km
                  </p>
                )}
                <p style={{ margin: '0.5em 0', color: '#666' }}>
                  <strong>Teléfono:</strong> {selectedPoint.properties?.phone || 'No disponible'}
                </p>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                style={{
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '0.5em 1em',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Estadísticas de Reciclaje */}
        <section style={{ marginBottom: '2em' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5em',
              marginBottom: '2em',
            }}
          >
            {[
              { label: 'Total Reciclado (5 meses)', value: '730 kg', color: '#4ECDC4' },
              { label: 'Promedio Mensual', value: '146 kg', color: '#45B7D1' },
              { label: 'Mes Actual', value: '180 kg', color: '#FF6B6B' },
              { label: 'Puntos Cercanos', value: `${recyclePoints.length}`, color: '#FFA07A' },
            ].map((kpi, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#fff',
                  padding: '1.5em',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderLeft: `5px solid ${kpi.color}`,
                }}
              >
                <p style={{ margin: 0, color: '#888', fontSize: '0.9em', fontWeight: 'bold' }}>{kpi.label}</p>
                <h3 style={{ margin: '0.5em 0 0 0', color: kpi.color, fontSize: '1.8em', fontWeight: 'bold' }}>
                  {kpi.value}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Gráficos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2em' }}>
          {/* Gráfico de Desechos Reciclados por Mes */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2em',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ margin: '0 0 1.5em 0', color: '#323C5A', fontSize: '1.3em', fontWeight: 'bold' }}>
              Desechos Reciclados por Mes
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyWasteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="reciclado" fill="#4ECDC4" name="Reciclado (kg)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="organico" fill="#98D8C8" name="Orgánico (kg)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="plastico" fill="#FF6B6B" name="Plástico (kg)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Tipos de Desecho */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2em',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ margin: '0 0 1.5em 0', color: '#323C5A', fontSize: '1.3em', fontWeight: 'bold' }}>
              Distribución de Desechos Reciclados
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {wasteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla de Detalles */}
        <section
          style={{
            backgroundColor: '#fff',
            padding: '2em',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginTop: '2em',
          }}
        >
          <h2 style={{ margin: '0 0 1.5em 0', color: '#323C5A', fontSize: '1.3em', fontWeight: 'bold' }}>
            Desglose Detallado de Desechos
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.95em',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '2px solid #4ECDC4' }}>
                  <th style={{ padding: '1em', textAlign: 'left', color: '#323C5A', fontWeight: 'bold' }}>
                    Tipo de Desecho
                  </th>
                  <th style={{ padding: '1em', textAlign: 'left', color: '#323C5A', fontWeight: 'bold' }}>
                    Porcentaje
                  </th>
                  <th style={{ padding: '1em', textAlign: 'left', color: '#323C5A', fontWeight: 'bold' }}>
                    Kilogramos
                  </th>
                  <th style={{ padding: '1em', textAlign: 'left', color: '#323C5A', fontWeight: 'bold' }}>
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {wasteTypeData.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '1em', color: '#555' }}>{item.name}</td>
                    <td style={{ padding: '1em', color: '#555' }}>{item.value}%</td>
                    <td style={{ padding: '1em', color: '#555' }}>{item.kg.toLocaleString()}</td>
                    <td style={{ padding: '1em' }}>
                      <span
                        style={{
                          backgroundColor: '#d4edda',
                          color: '#155724',
                          padding: '0.4em 0.8em',
                          borderRadius: '6px',
                          fontSize: '0.85em',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓ Reciclado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MapCiudadano;
