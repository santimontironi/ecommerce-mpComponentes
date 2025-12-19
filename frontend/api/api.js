import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL_DEV,
    withCredentials: true
});

export const loginAdminAxios = (data) => {
    return api.post("/login", data );    
};

export const dashboardAdminAxios = () => {
    return api.get("/dashboard");
}