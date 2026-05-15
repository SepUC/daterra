import React from 'react';
import { ChevronDown } from 'lucide-react';
import { TEST_USERS, ROLE_PERMISSIONS } from '../constants/testUsers';

/**
 * Componente para mostrar credenciales de prueba
 * Solo visible en desarrollo
 */
export default function TestCredentialsHelper() {
  const [isOpen, setIsOpen] = React.useState(false);

  if (import.meta.env.VITE_ENVIRONMENT === 'production') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2em',
        right: '2em',
        zIndex: 999,
        backgroundColor: '#f0f0f0',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'monospace',
        fontSize: '0.85em',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '1em',
          border: 'none',
          backgroundColor: '#FFD700',
          color: '#000',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5em',
        }}
      >
        🧪 Credenciales de Prueba
        <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : '' }} />
      </button>

      {isOpen && (
        <div style={{ padding: '1.5em', maxHeight: '500px', overflowY: 'auto' }}>
          <p style={{ margin: '0 0 1em 0', fontWeight: 'bold', color: '#333' }}>
            Usuarios para testing (Backend: AWS MySQL):
          </p>

          {TEST_USERS.map((user) => (
            <div
              key={user.id}
              style={{
                marginBottom: '1em',
                padding: '1em',
                backgroundColor: '#fff',
                borderLeft: `4px solid ${ROLE_PERMISSIONS[user.role]?.color || '#999'}`,
                borderRadius: '6px',
              }}
            >
              <p style={{ margin: '0 0 0.5em 0', fontWeight: 'bold', color: '#333' }}>
                {user.name}
              </p>
              <p style={{ margin: '0 0 0.3em 0', color: '#666' }}>
                <strong>Email:</strong> {user.email}
              </p>
              <p style={{ margin: '0 0 0.3em 0', color: '#666' }}>
                <strong>Pass:</strong> {user.password}
              </p>
              <p style={{ margin: '0 0 0.3em 0', color: '#666' }}>
                <strong>Rol:</strong> {ROLE_PERMISSIONS[user.role]?.label}
              </p>
              {user.municipality && (
                <p style={{ margin: '0 0 0.3em 0', color: '#666' }}>
                  <strong>Municipio:</strong> {user.municipality}
                </p>
              )}
              <p style={{ margin: '0', color: '#999', fontSize: '0.8em' }}>
                Permisos: {user.permissions.length}
              </p>
            </div>
          ))}

          <div style={{ marginTop: '1.5em', padding: '1em', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
            <p style={{ margin: '0 0 0.5em 0', fontWeight: 'bold', color: '#1976d2' }}>
              📌 Nota de Seguridad:
            </p>
            <p style={{ margin: '0', color: '#555', fontSize: '0.8em' }}>
              Este helper solo es visible en desarrollo. En producción (AWS), los datos vienen del backend MySQL.
              Todos los datos están protegidos con autenticación y autorización.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
