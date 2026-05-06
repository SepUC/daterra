import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS, hasPermission } from '../constants/testUsers';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { Menu, LogOut, BarChart3, PieChart as PieChartIcon, Trash2, Shield, AlertCircle } from 'lucide-react';
import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';

// Datos de ejemplo para gráficos
const monthlyWasteData = [
  { month: 'Enero', reciclado: 450, organico: 300, plastico: 200 },
  { month: 'Febrero', reciclado: 520, organico: 280, plastico: 220 },
  { month: 'Marzo', reciclado: 480, organico: 310, plastico: 190 },
  { month: 'Abril', reciclado: 650, organico: 350, plastico: 250 },
  { month: 'Mayo', reciclado: 720, organico: 400, plastico: 280 },
  { month: 'Junio', reciclado: 680, organico: 380, plastico: 260 },
];

const topWasteData = [
  { name: 'Plástico', value: 35, kg: 1200 },
  { name: 'Papel', value: 25, kg: 850 },
  { name: 'Metal', value: 20, kg: 680 },
  { name: 'Vidrio', value: 15, kg: 510 },
  { name: 'Otros', value: 5, kg: 170 },
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, checkPermission } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error en logout:', err);
      navigate('/login');
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  const userRole = ROLE_PERMISSIONS[user.role];
  const canRecordWaste = checkPermission('record_waste');
  const canViewReports = checkPermission('view_reports');

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
            <BarChart3 size={20} />
            {sidebarOpen && <span>Dashboard</span>}
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
              <p style={{ margin: '0.3em 0 0 0', fontSize: '0.8em', opacity: 0.7 }}>
                <Shield size={12} style={{ display: 'inline', marginRight: '0.3em' }} />
                {userRole?.label}
              </p>
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
        {/* Información de Seguridad y Rol del Usuario */}
        {user && (
          <section style={{ marginBottom: '2em' }}>
            <div style={{ 
              backgroundColor: '#e8f5e9', 
              padding: '1.5em', 
              borderRadius: '12px', 
              borderLeft: `5px solid ${userRole?.color || '#999'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', gap: '1em', alignItems: 'start' }}>
                <Shield size={24} style={{ color: userRole?.color, marginTop: '0.2em' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5em 0', color: '#333' }}>
                    👤 {user.name}
                  </h3>
                  <p style={{ margin: '0 0 0.3em 0', color: '#666', fontSize: '0.95em' }}>
                    <strong>Rol:</strong> {userRole?.label}
                  </p>
                  <p style={{ margin: '0 0 0.3em 0', color: '#666', fontSize: '0.95em' }}>
                    <strong>Correo:</strong> {user.email}
                  </p>
                  {user.municipality && (
                    <p style={{ margin: '0 0 0.3em 0', color: '#666', fontSize: '0.95em' }}>
                      <strong>Municipalidad:</strong> {user.municipality}
                    </p>
                  )}
                  <p style={{ margin: '0.5em 0 0 0', color: '#666', fontSize: '0.9em' }}>
                    <strong>Permisos:</strong> {user.permissions?.length || 0} permisos asignados
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Header */}
        <section style={{ marginBottom: '3em' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '2em', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ margin: 0, color: '#323C5A', fontSize: '2.5em', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <BarChart3 size={32} style={{ color: '#4ECDC4' }} />
              Panel de Control - Gestión de Desechos
            </h1>
            <p style={{ margin: '0.5em 0 0 0', color: '#666' }}>Análisis de reciclaje y gestión ambiental</p>
          </div>
        </section>

        {/* KPIs */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5em', marginBottom: '2em' }}>
          {[
            { label: 'Total Reciclado (6 meses)', value: '3,500 kg', color: '#4ECDC4' },
            { label: 'Promedio Mensual', value: '583 kg', color: '#45B7D1' },
            { label: 'Mes Actual', value: '680 kg', color: '#FF6B6B' },
            { label: 'Objetivo Anual', value: '8,000 kg', color: '#FFA07A' },
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
        </section>

        {/* Gráficos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2em', marginBottom: '2em' }}>
          {!canViewReports && (
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#fff3cd',
              padding: '1.5em',
              borderRadius: '12px',
              border: '1px solid #ffc107',
              display: 'flex',
              gap: '1em',
              alignItems: 'start'
            }}>
              <AlertCircle size={24} style={{ color: '#ff9800', marginTop: '0.2em' }} />
              <div>
                <p style={{ margin: '0 0 0.5em 0', fontWeight: 'bold', color: '#333' }}>
                  🔒 Acceso Limitado
                </p>
                <p style={{ margin: '0', color: '#666' }}>
                  Tu rol ({userRole?.label}) no tiene permiso para ver todos los reportes. 
                  Contacta a un administrador si necesitas más acceso.
                </p>
              </div>
            </div>
          )}

          {/* Gráfico de Desechos Reciclados por Mes */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2em',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ margin: '0 0 1.5em 0', color: '#323C5A', fontSize: '1.3em', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <BarChart3 size={24} style={{ color: '#4ECDC4' }} />
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

          {/* Gráfico de Desechos Más Reciclados */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '2em',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ margin: '0 0 1.5em 0', color: '#323C5A', fontSize: '1.3em', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
              <PieChartIcon size={24} style={{ color: '#45B7D1' }} />
              Distribución de Desechos Más Reciclados
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topWasteData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topWasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name, props) => {
                    if (name === 'kg') return `${value} kg`;
                    return value;
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
                  <th style={{ padding: '1em', textAlign: 'left', color: '#323C5A', fontWeight: 'bold' }}>Tipo de Desecho</th>
                  <th style={{ padding: '1em', textAlign: 'left', color: '#323C5A', fontWeight: 'bold' }}>Porcentaje</th>
                  <th style={{ padding: '1em', textAlign: 'left', color: '#323C5A', fontWeight: 'bold' }}>Kilogramos</th>
                  <th style={{ padding: '1em', textAlign: 'left', color: '#323C5A', fontWeight: 'bold' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {topWasteData.map((item, idx) => (
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
                        ✓ Procesado
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

export default Dashboard;
