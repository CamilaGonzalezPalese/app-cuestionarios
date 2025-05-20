import axios from 'axios';

// Configuración base de Axios
const API_BASE = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 👉 Reemplazo de fetchJson con Axios
export const fetchJson = async (url, config = {}) => {
    try {
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (error) {
        // Podés expandir esto con manejo más fino si querés
        throw new Error(error.response?.data?.message || 'Error en la red');
    }
};

// 👉 Generador de servicios CRUD
export const createBaseService = (resource) => {
    const baseUrl = `/${resource}`;

    return {
        getAll: (config = {}) => axiosInstance.get(baseUrl, config),
        getById: (id, config = {}) => axiosInstance.get(`${baseUrl}/${id}`, config),
        create: (data) => axiosInstance.post(baseUrl, data),
        update: (id, data) => axiosInstance.put(`${baseUrl}/${id}`, data),
        remove: (id) => axiosInstance.delete(`${baseUrl}/${id}`),
    };
};

// 👉 Servicios para cada recurso
export const cuestionarioService = createBaseService('cuestionario');
export const preguntaService = createBaseService('pregunta');
export const usuarioService = createBaseService('usuarios');
export const respuestaService = createBaseService('respuesta');
