import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        // Si el login es exitoso, devolvemos los datos del usuario
        return response.data;
    } catch (error) {
        // Manejamos el error (401, 404, etc.)
        throw error.response ? error.response.data : "Error de conexión";
    }
};