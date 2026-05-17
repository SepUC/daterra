import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Trash2, RefreshCw } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
        <div style={{ display: 'flex', width: '100vw', height: '100vh', margin: 0, padding: 0, fontFamily: 'Source Sans Pro, sans-serif', overflow: 'hidden', backgroundColor: '#fff' }}>

            {/* BARRA LATERAL IZQUIERDA (NAVEGACIÓN) */}
            <aside style={{ width: '260px', backgroundColor: '#4ee66f', color: '#2e354f', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5em', flexShrink: 0, height: '100vh', boxSizing: 'border-box' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6em', marginBottom: '2.5em', borderBottom: '1px solid rgba(46,53,79,0.1)', paddingBottom: '1.2em' }}>
                        <Trash2 size={24} style={{ color: '#4c785c' }} />
                        <h2 style={{ margin: 0, fontSize: '1.3em', fontWeight: '600' }}>Daterra</h2>
                    </div>
                    <div style={{ backgroundColor: 'rgba(76,120,92,0.15)', padding: '0.8em 1em', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.7em', color: '#2e354f' }}>
                        <MapPin size={18} />
                        <span>Mapa de Puntos</span>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(46,53,79,0.1)', paddingTop: '1.2em' }}>
                    <div style={{ marginBottom: '1.2em', fontSize: '0.85em', color: '#2e354f' }}>Conectado como:<br /><strong>{activeUser.name}</strong></div>
                    <button onClick={async () => { if(logout) await logout(); navigate('/login'); }} style={{ width: '100%', padding: '0.7em', backgroundColor: '#FF6B6B', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9em', transition: 'backgroundColor 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e85555'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF6B6B'}>Cerrar Sesión</button>
                </div>
            </aside>

            {/* SECCIÓN PRINCIPAL DE CONTENIDO */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

                {/* HEADER SUPERIOR */}
                <header style={{ backgroundColor: '#66c388', color: '#fff', padding: '1em 2em', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', boxSizing: 'border-box', flexShrink: 0 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.4em', fontWeight: '500' }}>♻️ Puntos de Reciclaje</h1>
                        <span style={{ fontSize: '0.8em', opacity: 0.85 }}>Base de datos AWS Conectada • Renderizado por Hardware Activo</span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '0.5em 1em', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5em', fontSize: '0.85em' }}
                    >
                        <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
                        {isFetching ? "Sincronizando..." : "Sincronizar AWS"}
                    </button>
                </header>

                {/* WORKSPACE DIVIDIDO A PANTALLA COMPLETA (Ampliamos la columna izquierda a 360px) */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px 1fr', height: 'calc(100vh - 70px)', overflow: 'hidden', width: '100%' }}>

                    {/* PANEL IZQUIERDO DE BÚSQUEDAS Y TARJETAS */}
                    <div style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(100vh - 70px)', backgroundColor: '#fff', overflow: 'hidden' }}>
                        <div style={{ padding: '1.2em', borderBottom: '1px solid #edf2f7', flexShrink: 0 }}>
                            <span style={{ fontSize: '0.8em', color: '#718096', textTransform: 'uppercase', fontWeight: '700' }}>Puntos en el Radio</span>
                            <div style={{ fontSize: '1.3em', fontWeight: '700', color: '#2d3748', margin: '0.2em 0' }}>{filteredPoints.length} encontrados</div>

                            {/* Contenedor de Filtros optimizado con CSS Grid de 3 columnas */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '0.8em' }}>
                                {['todos', 'limpio', 'verde'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFiltroActivo(f)}
                                        style={{
                                            padding: '8px 0', // Eliminamos padding lateral para que se ajuste perfecto al grid
                                            borderRadius: '20px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '0.78em',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                            backgroundColor: filtroActivo === f ? '#4c785c' : '#f7fafc',
                                            color: filtroActivo === f ? '#fff' : '#4a5568',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {f === 'todos' ? 'Todos' : f === 'limpio' ? 'Limpio' : 'Verde'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CONTENEDOR CON BARRA DE DESPLAZAMIENTO FORZADA */}
                        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '100%', backgroundColor: '#fff', paddingRight: '2px' }}>
                            {filteredPoints.length === 0 ? (
                                <div style={{ padding: '2em', textAlign: 'center', color: '#a0aec0', fontSize: '0.9em' }}>No se encontraron puntos en este rango.</div>
                            ) : (
                                filteredPoints.map((punto, i) => {
                                    const tipoTexto = (punto.type || punto.tipoResiduo || '').toLowerCase();
                                    const esLimpio = tipoTexto.includes('pl') || tipoTexto.includes('limpio');
                                    const direccionCompleta = formatearDireccion(punto);

                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setCentroMapa({ lat: parseFloat(punto.lat || punto.latitud), lng: parseFloat(punto.lng || punto.longitud) })}
                                            style={{ padding: '1.1em 1.4em', borderBottom: '1px solid #f7fafc', cursor: 'pointer', transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f7fafc'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '0.9em', marginBottom: '0.2em' }}>{punto.owner || punto.nombre || "Punto de Reciclaje"}</div>
                                            <div style={{ fontSize: '0.78em', color: '#718096', marginBottom: '0.5em' }}>📍 {direccionCompleta}</div>
                                            <span style={{ fontSize: '0.65em', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', backgroundColor: esLimpio ? '#e6fffa' : '#ebf8ff', color: esLimpio ? '#047481' : '#2b6cb0' }}>
                        {esLimpio ? 'PUNTO LIMPIO' : 'PUNTO VERDE'}
                      </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* VISOR DEL MAPA OPTIMIZADO POR CANVAS */}
                    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#e5e9f0' }}>
                        <MapContainer
                            center={[centroMapa.lat, centroMapa.lng]}
                            zoom={12}
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
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
                                            <div style={{ minWidth: '150px' }}>
                                                <strong style={{ color: colorMarcador, fontSize: '0.95em' }}>
                                                    {punto.owner || punto.nombre}
                                                </strong><br/>
                                                <span style={{ fontSize: '0.85em', color: '#555', marginTop: '3px', display: 'inline-block' }}>
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