import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.VITE_BACKEND_URL_DEV,
});

export const loginAdminAxios = (data) => {
    return api.post("/admin/login", { data });    
};

export const dashboardAdminAxios = () => {
    return api.get("/dashboard");
}