import axios from "axios";

const competitionHttp = axios.create({
    baseURL: "https://netball-api-stg.worldsportaction.com/competition"
});

competitionHttp.defaults.timeout = 180000;

competitionHttp.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default competitionHttp;
