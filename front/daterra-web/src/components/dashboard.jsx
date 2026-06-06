import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS } from '../constants/testUsers';
import apiService from '../services/apiService';
import {
  buildWasteDashboardData,
  formatToneladas,
  normalizeDashboardError,
} from '../utils/wasteAnalytics';
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
import { Menu, LogOut, BarChart3, PieChart as PieChartIcon, Trash2, Shield, AlertCircle } from 'lucide-react';
import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';
import '../styles/shared.css';
import '../styles/dashboard.css';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout, checkPermission } = useAuth();

  const {
    data: wasteData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['waste-dashboard'],
    queryFn: () => apiService.getWasteDashboardData(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

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
  const canViewReports = checkPermission('view_reports');
  const dashboardData = buildWasteDashboardData(
    wasteData?.regions ?? [],
    wasteData?.treatments ?? [],
  );

  const errorMessage = isError ? normalizeDashboardError(error) : null;
  const totalToneladas = formatToneladas(dashboardData.metrics.totalToneladas);
  const promedioPorRegion = formatToneladas(dashboardData.metrics.averagePerRegion);
  const topRegion = dashboardData.metrics.topRegion?.label || 'Sin datos';
  const topTreatment = dashboardData.metrics.topTreatment?.label || 'Sin datos';

  const truncateLabel = (label, maxLength = 15) => {
  return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
  };

  const kpis = [
    { label: 'Toneladas totales', value: `${totalToneladas} t`, color: '#4ECDC4' },
    { label: 'Regiones con dato', value: `${dashboardData.metrics.regionCount}`, color: '#45B7D1' },
    { label: 'Tratamientos registrados', value: `${dashboardData.metrics.treatmentCount}`, color: '#FF6B6B' },
    { label: 'Promedio por región', value: `${promedioPorRegion} t`, color: '#FFA07A' },
  ];

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
              Panel de Control - Residuos Reales
            </h1>
            <p>Resumen agregado desde el backend para regiones y tratamientos de residuos</p>
          </div>
        </section>

        {/* KPIs */}
        <section className="kpi-section">
          {kpis.map((kpi, idx) => (
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

          {isLoading && (
            <div className="dashboard-status-card dashboard-status-card--loading">
              <div className="dashboard-status-card__title">Cargando residuos reales...</div>
              <p>Consultando el backend para regiones y tratamientos agregados.</p>
            </div>
          )}

          {errorMessage && (
            <div className="dashboard-status-card dashboard-status-card--error">
              <div className="dashboard-status-card__title">
                <AlertCircle size={20} />
                Error al cargar residuos
              </div>
              <p>{errorMessage}</p>
              <button className="dashboard-status-card__retry" onClick={() => refetch()}>
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && !dashboardData.hasData && (
            <div className="dashboard-status-card dashboard-status-card--empty">
              <div className="dashboard-status-card__title">Sin residuos agregados</div>
              <p>El backend respondió correctamente, pero todavía no hay registros consolidados para mostrar.</p>
            </div>
          )}

          <div className="chart-card">
            <h2>
              <BarChart3 size={24} style={{ color: '#4ECDC4' }} />
              Residuos por región
            </h2>
            {isLoading ? (
              <div className="chart-empty-state">Cargando gráfico...</div>
            ) : dashboardData.regionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.regionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                        dataKey="label" 
                        stroke="#888" 
                        interval={0} 
                        angle={-25} 
                        textAnchor="end" 
                        height={60} 
                        tickFormatter={(label) => truncateLabel(label, 12)} 
                      />
                  <YAxis stroke="#888" tickFormatter={(value) => formatToneladas(value)} />
                  <Tooltip
                    formatter={(value) => [`${formatToneladas(value)} t`, 'Toneladas']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#4ECDC4" name="Toneladas de residuos" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty-state">No hay regiones con residuos para representar.</div>
            )}
          </div>

          <div className="chart-card">
            <h2>
              <PieChartIcon size={24} style={{ color: '#45B7D1' }} />
              Distribución por tratamiento
            </h2>
            {isLoading ? (
              <div className="chart-empty-state">Cargando gráfico...</div>
            ) : dashboardData.treatmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.treatmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="label"
                  >
                    {dashboardData.treatmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${formatToneladas(value)} t`, 'Toneladas']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty-state">No hay tratamientos con residuos para representar.</div>
            )}
          </div>
        </div>

        {/* Tabla de Detalles */}
        <section className="table-section">
          <h2>Desglose detallado por región</h2>
          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Región</th>
                  <th>Porcentaje</th>
                  <th>Toneladas</th>
                  <th>Referencia</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.regionData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.label}</td>
                    <td>{item.percentage.toFixed(1)}%</td>
                    <td>{formatToneladas(item.value)}</td>
                    <td>
                      <span className="table-status-badge">Backend SINADER</span>
                    </td>
                  </tr>
                ))}
                {!dashboardData.regionData.length && (
                  <tr>
                    <td colSpan="4" className="table-empty-row">
                      Sin datos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="table-footnote">
            Fuente: <strong>regiones</strong> y <strong>tratamientos</strong> agregados desde /api/sinader.
            {dashboardData.metrics.topRegion && (
              <> Región líder: <strong>{topRegion}</strong>.</>
            )}
            {dashboardData.metrics.topTreatment && (
              <> Tratamiento líder: <strong>{topTreatment}</strong>.</>
            )}
            {isFetching && !isLoading && ' Actualizando datos...'}
          </p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
