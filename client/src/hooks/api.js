
import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
    let token = localStorage.getItem("jwt_token");
    const headers = { ...config.headers };
    if (token) {
        headers.Authorization = `${token}`;
    }
    // headers.post["Content-Type"] = "application/json";
    headers['Content-Type'] = 'application/json; charset=utf-8';
    return { ...config, headers };
});

export default api;