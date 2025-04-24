import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Ошибка API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
