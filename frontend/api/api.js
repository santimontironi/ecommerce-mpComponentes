import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL_DEV,
    withCredentials: true
});

export const loginAdminAxios = (data) => {
    return api.post("/login", data );    
};

export const logoutAdminAxios = () => {
    return api.post("/logout", {});
}

export const dashboardAdminAxios = () => {
    return api.get("/dashboard");
}

export const getAllProductsAxios = () => {
    return api.get("/getAllProducts");
}

export const addProductAxios = (data) => {
    return api.post("/addProduct", data);
}

export const getAllCategoriesAxios = () => {
    return api.get("/getAllCategories");
}

export const addCategoryAxios = (data) => {
    return api.post("/addCategory", data, { headers: { "Content-Type": "multipart/form-data" }});
}

export const deleteCategoryAxios = (id) => {
    return api.delete(`/deleteCategory/${id}`);
}