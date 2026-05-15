/**
 * API Service - Maneja todas las conexiones con el backend AWS
 * Soporta autenticación, gestión de usuarios y datos de desechos
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TIMEOUT = import.meta.env.VITE_REQUEST_TIMEOUT || 10000;

class APIService {
  /**
   * Realiza un fetch con timeout y manejo de errores
   */
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Timeout - Solicitud excedió el tiempo límite');
      }
      throw error;
    }
  }

  /**
   * AUTENTICACIÓN
   */

  // Registro de usuario
  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Login de usuario
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Logout
  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Verificar token
  async verifyToken() {
    return this.request('/auth/verify', { method: 'GET' });
  }

  /**
   * USUARIOS
   */

  // Obtener perfil del usuario autenticado
  async getUserProfile() {
    return this.request('/users/profile', { method: 'GET' });
  }

  // Actualizar perfil del usuario
  async updateUserProfile(data) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DESECHOS
   */

  // Obtener datos de desechos reciclados por mes
  async getMonthlyWasteData() {
    return this.request('/waste/monthly', { method: 'GET' });
  }

  // Obtener desechos más reciclados
  async getTopWasteTypes() {
    return this.request('/waste/top-types', { method: 'GET' });
  }

  // Obtener todos los registros de desechos
  async getWasteRecords(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/waste/records?${params}`, { method: 'GET' });
  }

  // Registrar nuevo desecho
  async recordWaste(data) {
    return this.request('/waste/record', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * ESTADÍSTICAS
   */

  // Obtener estadísticas generales
  async getStatistics() {
    return this.request('/statistics', { method: 'GET' });
  }

  // Obtener objetivos y progreso
  async getGoalsAndProgress() {
    return this.request('/goals/progress', { method: 'GET' });
  }
}

export default new APIService();
