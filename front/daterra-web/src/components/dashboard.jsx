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
import '../styles/shared.css';
import '../styles/dashboard.css';

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
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar" style={{ width: sidebarOpen ? '280px' : '80px' }}>
        <div className="sidebar-title-section">
          {sidebarOpen && (
            <h2>
              <Trash2 size={24} style={{ display: 'inline', marginRight: '0.5em' }} />
              Daterra
            </h2>
          )}
          <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="dashboard-nav">
          <div
            className="nav-item"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(76, 120, 92, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(46, 53, 79, 0.1)')}
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </div>
        </nav>

        {/* Usuario */}
        <div className="sidebar-user-section">
          {sidebarOpen && (
            <div className="user-info-block">
              <p className="user-info-label">Conectado como</p>
              <p className="user-info-name">{user.name}</p>
              <p className="user-role">
                <Shield size={12} />
                {userRole?.label}
              </p>
            </div>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className={`dashboard-main ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
        {/* Información de Seguridad y Rol del Usuario */}
        {user && (
          <section className="dashboard-security-section">
            <div className="security-card" style={{ borderLeftColor: userRole?.color || '#999' }}>
              <div className="security-card-icon">
                <Shield size={24} style={{ color: userRole?.color }} />
              </div>
              <div className="security-card-content">
                <h3>👤 {user.name}</h3>
                <p><strong>Rol:</strong> {userRole?.label}</p>
                <p><strong>Correo:</strong> {user.email}</p>
                {user.municipality && (
                  <p><strong>Municipalidad:</strong> {user.municipality}</p>
                )}
                <p className="security-card-permissions">
                  <strong>Permisos:</strong> {user.permissions?.length || 0} permisos asignados
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Header */}
        <section style={{ marginBottom: '3em' }}>
          <div className="card-header">
            <h1>
              <BarChart3 size={32} style={{ color: '#4ECDC4' }} />
              Panel de Control - Gestión de Desechos
            </h1>
            <p>Análisis de reciclaje y gestión ambiental</p>
          </div>
        </section>

        {/* KPIs */}
        <section className="kpi-section">
          {[
            { label: 'Total Reciclado (6 meses)', value: '3,500 kg', color: '#4ECDC4' },
            { label: 'Promedio Mensual', value: '583 kg', color: '#45B7D1' },
            { label: 'Mes Actual', value: '680 kg', color: '#FF6B6B' },
            { label: 'Objetivo Anual', value: '8,000 kg', color: '#FFA07A' },
          ].map((kpi, idx) => (
            <div key={idx} className="kpi-card" style={{ borderLeftColor: kpi.color }}>
              <p className="kpi-label">{kpi.label}</p>
              <h3 className="kpi-value" style={{ color: kpi.color }}>
                {kpi.value}
              </h3>
            </div>
          ))}
        </section>

        {/* Gráficos */}
        <div className="charts-section">
          {!canViewReports && (
            <div className="access-warning">
              <AlertCircle size={24} className="access-warning-icon" />
              <div className="access-warning-content">
                <p>🔒 Acceso Limitado</p>
                <p>
                  Tu rol ({userRole?.label}) no tiene permiso para ver todos los reportes. 
                  Contacta a un administrador si necesitas más acceso.
                </p>
              </div>
            </div>
          )}

          {/* Gráfico de Desechos Reciclados por Mes */}
          <div className="chart-card">
            <h2>
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
          <div className="chart-card">
            <h2>
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
        <section className="table-section">
          <h2>Desglose Detallado de Desechos</h2>
          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Tipo de Desecho</th>
                  <th>Porcentaje</th>
                  <th>Kilogramos</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {topWasteData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.value}%</td>
                    <td>{item.kg.toLocaleString()}</td>
                    <td>
                      <span className="table-status-badge">✓ Procesado</span>
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
