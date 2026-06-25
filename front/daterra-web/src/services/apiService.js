/**
 * API Service - Maneja todas las conexiones con el backend
 */
const API_URL = import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');
const TIMEOUT = import.meta.env.VITE_REQUEST_TIMEOUT || 10000;

class APIService {

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
        // Manejo específico: Si recibimos 401, el token expiró o es inválido
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login'; // O tu lógica de redirección
        }
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

  async login(email, password) {
    // Llamada al backend
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // GUARDADO: Aquí es donde capturamos el token real del servidor
    if (data && data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  }

  async logout() {
    localStorage.removeItem('authToken'); // Limpiamos al cerrar sesión
    // Si tu API tiene un endpoint de logout, puedes llamarlo aquí:
    // return this.request('/auth/logout', { method: 'POST' });
  }

  // ... (tus otros métodos se mantienen iguales)

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getEstadisticasRM(año) {
    if (año === undefined || año === null || año === '') {
      return this.request('/sinader/estadisticas/rm');
    }

    return this.request(`/sinader/estadisticas/rm/${año}`);
  }
}

export default new APIService();