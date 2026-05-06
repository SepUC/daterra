import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/apiService';
import { validateTestCredentials, hasPermission } from '../constants/testUsers';

/**
 * AuthContext - Contexto global de autenticación
 * Maneja el estado del usuario autenticado y operaciones de auth
 */
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error restaurando sesión:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Función de login
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Intentar con API real primero
      let response;
      try {
        response = await apiService.login(email, password);
      } catch (apiError) {
        console.log('Backend no disponible, usando test users...');
        
        // Si el backend no está disponible, usar test users
        const testUser = validateTestCredentials(email, password);
        if (!testUser) {
          throw new Error('Credenciales inválidas');
        }

        // Crear un token simulado
        const mockToken = `mock-token-${testUser.id}-${Date.now()}`;
        response = {
          token: mockToken,
          user: testUser,
        };
      }

      // Guardar token y usuario
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);
      setIsLoading(false);

      return response.user;
    } catch (err) {
      const errorMessage = err.message || 'Error en login';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Función de registro
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Intentar con API real primero
      let response;
      try {
        response = await apiService.register(name, email, password);
      } catch (apiError) {
        console.log('Backend no disponible, crear usuario en test...');
        
        // Crear usuario de prueba
        const newUser = {
          id: Math.random() * 1000,
          name,
          email,
          role: 'viewer',
          permissions: ['view_own_data'],
          municipality: null,
          status: 'active',
          createdAt: new Date().toISOString(),
        };

        const mockToken = `mock-token-${newUser.id}-${Date.now()}`;
        response = {
          token: mockToken,
          user: newUser,
        };
      }

      // Guardar token y usuario
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);
      setIsLoading(false);

      return response.user;
    } catch (err) {
      const errorMessage = err.message || 'Error en registro';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Función de logout
   */
  const logout = async () => {
    setIsLoading(true);

    try {
      // Intentar logout en backend
      try {
        await apiService.logout();
      } catch (err) {
        console.log('Error desconectando del backend, continuando...');
      }

      // Limpiar storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');

      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  const checkPermission = (permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    checkPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
