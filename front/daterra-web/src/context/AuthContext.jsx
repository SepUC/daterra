import React, { createContext, useState, useContext, useEffect } from 'react';
// 1. Importamos tus nuevos servicios de Axios
import { login as apiLogin, register as apiRegister } from '../services/authService';
import { hasPermission } from '../constants/testUsers';

const AuthContext = createContext();

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
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Login adaptado para Spring Boot (AWS)
   */
  const login = async (runUsuario, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // 2. Llamamos al servicio que usa Axios hacia http://localhost:8080/api/auth/login
      const userData = await apiLogin(runUsuario, password);

      // 3. Guardamos el objeto usuario que viene de Java (Jose Vargas)
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);

      setIsLoading(false);
      return userData;
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

      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);

      setIsLoading(false);
      return newUser;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      throw new Error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
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