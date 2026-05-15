import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth";

export const login = async (runUsuario, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            runUsuario: parseInt(runUsuario),
            password: password
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : "Error de conexión";
    }
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : "Error al registrar";
    }
};