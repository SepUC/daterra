import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || '/api'}/auth`;

const authClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const login = async (email, password) => {
    try {
        const response = await authClient.post('/login', {
            email: email,
            password: password
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : "Error de conexión";
    }
};

export const register = async (userData) => {
    try {
        const response = await authClient.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : "Error al registrar";
    }
};