import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Trash2, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/shared.css';
import '../styles/mapCiudadano.css';

// Componente para redibujar automáticamente el mapa cuando cambie el centro o tamaño de pantalla
function ControlMapa({ centro }) {
    const map = useMap();
    useEffect(() => {
        if (centro) {
            map.setView([centro.lat, centro.lng], 13);
            const timer = setTimeout(() => { map.invalidateSize(); }, 200);
            return () => clearTimeout(timer);
        }
    }, [centro, map]);
    return null;
}

// Función Haversine para calcular distancia real en km entre coordenadas
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Petición HTTP a tu API de AWS
const fetchRecyclePoints = async () => {
    const response = await fetch('http://localhost:8080/api/puntos');
    if (!response.ok) throw new Error('Error al conectar con la API');
    return response.json();
};

export default function MapCiudadano() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Coordenadas fijas por defecto (Centro de Santiago)
    const [centroMapa, setCentroMapa] = useState({ lat: -33.4405632, lng: -70.6614779 });
    const radioMaximo = 20;

    const [filtroActivo, setFiltroActivo] = useState('todos');
    const [filteredPoints, setFilteredPoints] = useState([]);

    const activeUser = user || { name: 'José (Modo Desarrollo)' };

    // Consumo asíncrono con React Query
    const { data: serverPoints, refetch, isFetching } = useQuery({
        queryKey: ['recyclePoints'],
        queryFn: fetchRecyclePoints,
        retry: false
    });

    // Filtrado geográfico y por tipo de residuo
    useEffect(() => {
        if (!serverPoints) return;

        let resultado = serverPoints.filter(p => {
            const pLat = parseFloat(p.lat || p.latitud);
            const pLng = parseFloat(p.lng || p.longitud);
            if (isNaN(pLat) || isNaN(pLng)) return false;

            const distancia = calcularDistancia(centroMapa.lat, centroMapa.lng, pLat, pLng);
            if (distancia > radioMaximo) return false;

            const tipo = (p.type || p.tipoResiduo || '').toLowerCase();
            if (filtroActivo === 'limpio') return tipo === 'pl' || tipo.includes('limpio');
            if (filtroActivo === 'verde') return tipo === 'pv' || tipo.includes('verde');

            return true;
        });

        setFilteredPoints(resultado);
    }, [serverPoints, centroMapa, filtroActivo]);

    // Función limpiadora inteligente para estandarizar direcciones y comunas
    const formatearDireccion = (punto) => {
        const direccionBase = punto.address_name || punto.direccion || "Sin dirección";
        const comunaObjeto = punto.commune && punto.commune.name ? punto.commune.name : '';

        if (comunaObjeto && !direccionBase.toLowerCase().includes(comunaObjeto.toLowerCase())) {
            return `${direccionBase}, ${comunaObjeto}`;
        }
        return direccionBase;
    };

    return (
        <div className="map-container">

            {/* BARRA LATERAL IZQUIERDA (NAVEGACIÓN) */}
            <aside className="map-sidebar">
                <div>
                    <div className="sidebar-header">
                        <Trash2 size={24} style={{ color: '#4c785c' }} />
                        <h2>Daterra</h2>
                    </div>
                    <div className="sidebar-nav-item">
                        <MapPin size={18} />
                        <span>Mapa de Puntos</span>
                    </div>
                </div>
                <div className="sidebar-footer">
                    <div className="sidebar-user-info">Conectado como:<br /><strong>{activeUser.name}</strong></div>
                    <button className="btn-logout" onClick={async () => { if(logout) await logout(); navigate('/login'); }}>Cerrar Sesión</button>
                </div>
            </aside>

            {/* SECCIÓN PRINCIPAL DE CONTENIDO */}
            <main className="map-main-content">

                {/* HEADER SUPERIOR */}
                <header className="map-header" style={{ backgroundColor: '#66c388' }}>
                    <div>
                        <h1>♻️ Puntos de Reciclaje</h1>
                        <span className="map-header-subtitle">Base de datos AWS Conectada • Renderizado por Hardware Activo</span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="sync-button"
                    >
                        <RefreshCw size={14} className={isFetching ? "sync-icon spinning" : "sync-icon"} />
                        {isFetching ? "Sincronizando..." : "Sincronizar AWS"}
                    </button>
                </header>

                {/* WORKSPACE DIVIDIDO A PANTALLA COMPLETA */}
                <div className="map-workspace">

                    {/* PANEL IZQUIERDO DE BÚSQUEDAS Y TARJETAS */}
                    <div className="points-panel">
                        <div className="points-panel-header">
                            <span className="points-count-label">Puntos en el Radio</span>
                            <div className="points-count-value">{filteredPoints.length} encontrados</div>

                            {/* Contenedor de Filtros */}
                            <div className="map-filter-buttons">
                                {['todos', 'limpio', 'verde'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFiltroActivo(f)}
                                        className={`map-filter-btn ${filtroActivo === f ? 'active' : ''}`}
                                    >
                                        {f === 'todos' ? 'Todos' : f === 'limpio' ? 'Limpio' : 'Verde'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CONTENEDOR CON BARRA DE DESPLAZAMIENTO FORZADA */}
                        <div className="points-list">
                            {filteredPoints.length === 0 ? (
                                <div className="points-list-empty">No se encontraron puntos en este rango.</div>
                            ) : (
                                filteredPoints.map((punto, i) => {
                                    const tipoTexto = (punto.type || punto.tipoResiduo || '').toLowerCase();
                                    const esLimpio = tipoTexto.includes('pl') || tipoTexto.includes('limpio');
                                    const direccionCompleta = formatearDireccion(punto);

                                    return (
                                        <div
                                            key={i}
                                            className="point-item"
                                            onClick={() => setCentroMapa({ lat: parseFloat(punto.lat || punto.latitud), lng: parseFloat(punto.lng || punto.longitud) })}
                                        >
                                            <div className="point-item-name">{punto.owner || punto.nombre || "Punto de Reciclaje"}</div>
                                            <div className="point-item-address">📍 {direccionCompleta}</div>
                                            <span className={`point-item-type ${esLimpio ? 'clean' : 'green'}`}>
                                                {esLimpio ? 'PUNTO LIMPIO' : 'PUNTO VERDE'}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* VISOR DEL MAPA OPTIMIZADO POR CANVAS */}
                    <div className="map-viewer">
                        <MapContainer
                            center={[centroMapa.lat, centroMapa.lng]}
                            zoom={12}
                            className="map-canvas"
                            zoomControl={true}
                            preferCanvas={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <ControlMapa centro={centroMapa} />

                            <CircleMarker
                                center={[centroMapa.lat, centroMapa.lng]}
                                radius={12}
                                pathOptions={{ fillColor: '#718096', color: '#4a5568', weight: 2, fillOpacity: 0.9 }}
                            >
                                <Popup><strong>📍 Centro del rango de búsqueda</strong></Popup>
                            </CircleMarker>

                            {filteredPoints.map((punto, idx) => {
                                const latP = parseFloat(punto.lat || punto.latitud);
                                const lngP = parseFloat(punto.lng || punto.longitud);
                                const direccionCompletaPopup = formatearDireccion(punto);

                                const tipoTexto = (punto.type || punto.tipoResiduo || '').toLowerCase();
                                const esLimpio = tipoTexto.includes('pl') || tipoTexto.includes('limpio');

                                const colorMarcador = esLimpio ? '#2b6cb0' : '#1e4620';

                                return (
                                    <CircleMarker
                                        key={idx}
                                        center={[latP, lngP]}
                                        radius={7}
                                        pathOptions={{
                                            fillColor: colorMarcador,
                                            color: '#ffffff',
                                            weight: 1.5,
                                            fillOpacity: 0.85
                                        }}
                                    >
                                        <Popup>
                                            <div className="popup-content" style={{ minWidth: '150px' }}>
                                                <strong style={{ color: colorMarcador, fontSize: '0.95em' }}>
                                                    {punto.owner || punto.nombre}
                                                </strong><br/>
                                                <span>
                                                    {direccionCompletaPopup}
                                                </span>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                );
                            })}
                        </MapContainer>
                    </div>

                </div>
            </main>
        </div>
    );
}