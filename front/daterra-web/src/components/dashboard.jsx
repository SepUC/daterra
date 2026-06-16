import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { formatToneladas, normalizeDashboardError } from '../utils/wasteAnalytics';
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
  ComposedChart
} from 'recharts';
import { Menu, LogOut, BarChart3, PieChart as PieChartIcon, Target, AlertCircle, Calendar } from 'lucide-react';
import '../assets/css/main.css';
import '../assets/css/fontawesome-all.min.css';
import '../styles/shared.css';
import '../styles/dashboard.css';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#B19CD9'];

// ==========================================
// 1. METAS FINALES DE LA LEY REP Y ENRO (%)
// ==========================================
const METAS_VALORIZACION = {
  'Papel y cartón': 70,
  'Vidrio': 65,
  'Cartón para líquidos': 60,
  'Metal': 55,
  'Plásticos': 45,
  'Orgánicos (ENRO)': 30, // Meta intermedia al 2030
};

// ==========================================
// 2. FUNCIÓN PARA NORMALIZAR TEXTO (AJUSTADA A DATOS REALES SINADER RM)
// ==========================================
const normalizarCategoriaREP = (rawMaterial) => {
  if (!rawMaterial) return 'Otros';
  
  const texto = rawMaterial.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  // MATERIALES RECICLABLES (Envases y Embalajes)
  if (texto.includes('papel') || texto.includes('carton')) return 'Papel y cartón';
  if (texto.includes('vidrio')) return 'Vidrio';
  if (texto.includes('plastic') || texto.includes('plastico')) return 'Plásticos';
  if (texto.includes('tetra') || texto.includes('liquido')) return 'Cartón para líquidos';
  if (texto.includes('metal') || texto.includes('chatarra') || texto.includes('aluminio')) return 'Metal';
  
  // RESIDUOS ORGÁNICOS (ENRO)
  if (texto.includes('biodegradable') || texto.includes('organic') || texto.includes('poda')) return 'Orgánicos (ENRO)';
  
  // BASURA COMÚN Y NO RECICLABLES
  return 'Otros'; 
};

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  
  const [anoSeleccionado, setAnoSeleccionado] = useState(2021);

  const {
    data: estadisticasRM,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sinader-rm-dashboard', anoSeleccionado], 
    queryFn: () => apiService.getEstadisticasRM(anoSeleccionado),
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

  if (!user) return <div>Cargando usuario...</div>;

  const errorMessage = isError ? normalizeDashboardError(error) : null;

  // ==========================================
  // TRANSFORMACIÓN Y AGRUPACIÓN DE DATOS
  // ==========================================
  const comunasData = estadisticasRM?.topComunasPorToneladas || [];
  const materialesRaw = estadisticasRM?.materialesPorToneladas || [];
  
  const totalToneladasRM = comunasData.reduce((acc, curr) => acc + (curr.toneladas || curr.totalToneladas || 0), 0);
  const totalComunas = comunasData.length;

  const toneladasAgrupadasPorREP = {};
  
  // Agrupamos usando nuestro filtro normalizador
  materialesRaw.forEach(mat => {
    const toneladas = mat.toneladas || mat.totalToneladas || 0; 
    const categoriaREP = normalizarCategoriaREP(mat.material);
    
    if (categoriaREP !== 'Otros') {
      if (!toneladasAgrupadasPorREP[categoriaREP]) {
        toneladasAgrupadasPorREP[categoriaREP] = 0;
      }
      toneladasAgrupadasPorREP[categoriaREP] += toneladas;
    }
  });

  // 1. Data para Gráfico de Torta (Distribución)
  const dataGraficoTorta = Object.keys(toneladasAgrupadasPorREP)
    .map(key => ({
      name: key,
      value: parseFloat(toneladasAgrupadasPorREP[key].toFixed(2)),
    }))
    .filter(item => item.value > 0);

  // 2. Data para Gráfico de Metas Ley REP (Barras Compuestas)
  // Calculamos el total SOLO de los residuos reciclables para obtener un % realista
  const totalReciclables = Object.keys(toneladasAgrupadasPorREP)
    .reduce((acc, key) => acc + toneladasAgrupadasPorREP[key], 0);

  const dataMetas = Object.keys(METAS_VALORIZACION).map(key => {
    const toneladasRecolectadas = toneladasAgrupadasPorREP[key] || 0;
    
    // El cálculo ahora se hace sobre la bolsa de reciclables, ignorando la basura común
    const porcentajeLogradoSimulado = totalReciclables > 0 
      ? (toneladasRecolectadas / totalReciclables) * 100 
      : 0;

    return {
      material: key,
      actual: parseFloat(porcentajeLogradoSimulado.toFixed(1)),
      meta: METAS_VALORIZACION[key],
      toneladas: parseFloat(toneladasRecolectadas.toFixed(1))
    };
  });

  const truncateLabel = (label, maxLength = 12) => {
    if (!label) return '';
    return label.length > maxLength ? label.substring(0, maxLength) + '...' : label;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar" style={{ width: sidebarOpen ? '280px' : '80px' }}>
        <div className="sidebar-title-section">
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="full_logo.png" alt="Daterra" style={{ height: '10em', width: 'auto', maxHeight: '70px' }} />
            </div>
          )}
          <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
        </div>
        <nav className="dashboard-nav">
          <div className="nav-item">
            <BarChart3 size={20} />
            {sidebarOpen && <span>Dashboard RM</span>}
          </div>
        </nav>
        <div className="sidebar-user-section">
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className={`dashboard-main ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
        
        <section style={{ marginBottom: '3em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="card-header" style={{ flex: 1 }}>
            <h1>
              <BarChart3 size={32} style={{ color: '#4ECDC4', marginRight: '10px' }} />
              Panel SINADER - Región Metropolitana
            </h1>
            <p>Monitoreo de toneladas por comuna y cumplimiento Ley REP / ENRO</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '10px 15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Calendar size={20} style={{ color: '#666', marginRight: '10px' }} />
            <label htmlFor="yearSelect" style={{ marginRight: '10px', fontWeight: 'bold', color: '#444' }}>Año:</label>
            <select 
              id="yearSelect" 
              value={anoSeleccionado} 
              onChange={(e) => setAnoSeleccionado(parseInt(e.target.value))}
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
              <option value={2021}>2021</option>
              <option value={2020}>2020</option>
            </select>
          </div>
        </section>

        {/* KPIs */}
        <section className="kpi-section">
          <div className="kpi-card" style={{ borderLeftColor: '#4ECDC4' }}>
            <p className="kpi-label">Toneladas Totales RM ({anoSeleccionado})</p>
            <h3 className="kpi-value" style={{ color: '#4ECDC4' }}>{formatToneladas(totalToneladasRM)} t</h3>
          </div>
          <div className="kpi-card" style={{ borderLeftColor: '#45B7D1' }}>
            <p className="kpi-label">Comunas Activas</p>
            <h3 className="kpi-value" style={{ color: '#45B7D1' }}>{totalComunas}</h3>
          </div>
        </section>

        <div className="charts-section">
          {isLoading && (
            <div className="dashboard-status-card dashboard-status-card--loading">
              <p>Cargando datos del año {anoSeleccionado}...</p>
            </div>
          )}

          {errorMessage && (
            <div className="dashboard-status-card dashboard-status-card--error">
              <AlertCircle size={20} />
              <p>{errorMessage}</p>
              <button onClick={() => refetch()}>Reintentar</button>
            </div>
          )}

          {/* Gráfico 1: Toneladas por Comuna RM */}
          <div className="chart-card">
            <h2>
              <BarChart3 size={24} style={{ color: '#4ECDC4', marginRight: '8px' }} />
              Toneladas Totales por Comuna
            </h2>
            {comunasData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={comunasData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="comuna" 
                    stroke="#888" 
                    interval={0} 
                    angle={-45} 
                    textAnchor="end" 
                    tickFormatter={(label) => truncateLabel(label, 15)} 
                  />
                  <YAxis stroke="#888" tickFormatter={(value) => formatToneladas(value)} />
                  <Tooltip formatter={(value) => [`${formatToneladas(value)} t`, 'Toneladas Totales']} />
                  <Bar dataKey="toneladas" fill="#4ECDC4" name="Toneladas Declaradas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="chart-empty-state">No hay datos de comunas para el año seleccionado.</p>
            )}
          </div>

          {/* Gráfico 2: Metas Ley REP */}
          <div className="chart-card">
            <h2>
              <Target size={24} style={{ color: '#FF6B6B', marginRight: '8px' }} />
              Cumplimiento Metas Ley REP y ENRO (%)
            </h2>
            <p style={{ fontSize: '0.85em', color: '#666', marginBottom: '15px' }}>
              Comparativa de valorización simulada vs meta final exigida a 12 años.
            </p>
            {dataMetas.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={dataMetas} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="material" stroke="#888" />
                  <YAxis unit="%" domain={[0, 100]} stroke="#888" />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name === 'actual' ? 'Valorización Actual' : 'Meta Ley/ENRO']} 
                  />
                  <Legend />
                  <Bar dataKey="actual" fill="#FF6B6B" name="% Actual" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  <Bar dataKey="meta" fill="#e0e0e0" name="% Meta Esperada" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <p className="chart-empty-state">No hay datos suficientes para calcular las metas este año.</p>
            )}
          </div>

          {/* Gráfico 3: Distribución Ley REP y ENRO */}
          <div className="chart-card">
            <h2>
              <PieChartIcon size={24} style={{ color: '#45B7D1', marginRight: '8px' }} />
              Distribución de Residuos Regulados
            </h2>
            <p style={{ fontSize: '0.85em', color: '#666', marginBottom: '15px' }}>
              Excluye basura municipal, enfocándose solo en reciclables y orgánicos.
            </p>
            {dataGraficoTorta.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={dataGraficoTorta}
                    cx="50%" cy="50%"
                    innerRadius={70} 
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value" nameKey="name"
                  >
                    {dataGraficoTorta.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${formatToneladas(value)} t`, 'Total Recuperado']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty-state">No se encontraron residuos reciclables/orgánicos este año.</div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;