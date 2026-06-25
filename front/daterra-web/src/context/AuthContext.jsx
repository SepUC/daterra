import React, { createContext, useState, useContext, useEffect } from 'react';
// 1. Importamos tus nuevos servicios de Axios
import { login as apiLogin, register as apiRegister } from '../services/authService';
import { hasPermission } from '../constants/testUsers';

const AuthContext = createContext();

const resolveUserTypeFromEmail = (email) => {
  if (!email || !email.includes('@')) return undefined;

  const domain = email.split('@')[1].toLowerCase();

  if (domain === 'metropolitana.cl' || domain === 'puentealto.cl') {
    return 1;
  }

  return 2;
};

const normalizeUser = (userData, fallbackEmail = '') => {
  if (!userData) return null;

  const email = userData.email || fallbackEmail || '';
  const displayName = userData.usuario
    || userData.name
    || [userData.primerNombre, userData.primerApellido].filter(Boolean).join(' ').trim()
    || email;

  return {
    ...userData,
    email,
    name: displayName,
    idTipoUsu: userData.idTipoUsu ?? resolveUserTypeFromEmail(email),
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar sesión al cargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error restaurando sesión:', err);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Login adaptado para Spring Boot (AWS)
   */
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // 2. Llamamos al servicio de autenticación y normalizamos la sesión local
      const userData = await apiLogin(email, password);
      const normalizedUser = normalizeUser(userData, email);

      if (userData?.token) {
        localStorage.setItem('authToken', userData.token);
      }

      localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      setIsLoading(false);
      return normalizedUser;
    } catch (err) {
      // El error viene de lo que configuramos en authService.js
      const errorMessage = typeof err === 'string' ? err : 'Credenciales inválidas';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  /**
   * Registro adaptado
   */
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newUser = await apiRegister(userData);

      const loginData = await apiLogin(userData.email, userData.password);
      const normalizedUser = normalizeUser({ ...newUser, ...loginData }, userData.email);

      if (loginData?.token) {
        localStorage.setItem('authToken', loginData.token);
      }

      localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      setIsLoading(false);
      return normalizedUser;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      throw new Error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const checkPermission = (permission) => {
    if (!user) return false;
    // Adaptamos según el rol que traiga tu tabla USUARIO (si tiene uno)
    return hasPermission(user.rol || 'viewer', permission);
  };

  const value = {
    user,
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}