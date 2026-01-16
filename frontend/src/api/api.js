import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL_DEV,
    withCredentials: true
});

export const loginAdminAxios = (data) => {
    return api.post("/login", data );    
}

export const logoutAdminAxios = () => {
    return api.post("/logout", {});
}

export const dashboardAdminAxios = () => {
    return api.get("/dashboard");
}

export const getAllProductsAxios = (categoryId) => {
  return api.get(`/getAllProducts/${categoryId}`)
}

export const getAllProductsAdminAxios = (categoryId) => {
  return api.get(`/getAllProductsAdmin/${categoryId}`)
}

export const getProductAxios = (id) => {
    return api.get(`/getProduct/${id}`)
}

export const getProductAdminAxios = (id) => {
    return api.get(`/getProductAdmin/${id}`)
}

export const addProductAxios = (data) => {
    return api.post("/addProduct", data, { headers: { "Content-Type": "multipart/form-data" }});
}

export const getAllCategoriesAxios = () => {
    return api.get("/getAllCategories");
}

export const getAllCategoriesWithoutParentsAxios = () => {
    return api.get("/getAllCategoriesWithoutParents");
}

export const getSubCategoriesAxios = (id) => {
    return api.get(`/getSubCategories/${id}`);
}

export const addCategoryAxios = (data) => {
    return api.post("/addCategory", data, { headers: { "Content-Type": "multipart/form-data" }});
}

export const deleteCategoryAxios = (id) => {
    return api.delete(`/deleteCategory/${id}`);
}

export const deleteProductAxios = (id) => {
    return api.delete(`/deleteProduct/${id}`);
}

export const editProductAxios = (id, data) => {
    return api.patch(`/editProduct/${id}`, data, { headers: { "Content-Type": "multipart/form-data" }});
}

export const importProductsAxios = (data) => {
    return api.post("/importProducts", data, { headers: { "Content-Type": "multipart/form-data" }});
}