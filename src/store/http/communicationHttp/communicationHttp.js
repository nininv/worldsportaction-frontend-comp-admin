import axios from "axios";

const http = axios.create({
    baseURL: process.env.REACT_APP_COMMON_API_URL,
});

http.interceptors.request.use((config) => {
    const { token } = localStorage;

    const newConfig = config;
    if (token) {
        newConfig.headers.Authorization = token;
    }
    return newConfig;
});

export default http;
