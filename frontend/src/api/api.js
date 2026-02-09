import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL_DEV,
    withCredentials: true
});


/* -------------------------AUTH-------------------------------- */ 

export const loginAdminAxios = (data) => {
    return api.post("/login", data );    
}

export const logoutAdminAxios = () => {
    return api.post("/logout", {});
}

export const dashboardAdminAxios = () => {
    return api.get("/dashboard");
}

/* -------------------------PRODUCTS-------------------------------- */ 

export const getProductsAxios = (categoryId) => {
  return api.get(`/getProducts/${categoryId}`)
}

export const getProductsAdminAxios = (categoryId) => {
  return api.get(`/getProductsAdmin/${categoryId}`)
}

export const getAllProductsAxios = () => {
    return api.get("/getAllProducts");
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

export const deleteProductAxios = (id) => {
    return api.delete(`/deleteProduct/${id}`);
}

export const editProductAxios = (id, data) => {
    return api.patch(`/editProduct/${id}`, data, { headers: { "Content-Type": "multipart/form-data" }});
}

export const importProductsAxios = (data) => {
    return api.post("/importProducts", data, { headers: { "Content-Type": "multipart/form-data" }});
}

export const getProductsWithoutStockAxios = () => {
    return api.get("/getAllProductsWithoutStock");
}

export const orderProductAxios = (data) => {
    return api.post("/orderProduct", data);
}

export const reserveProductAxios = (data) => {
    return api.post("/reserve", data);
}

/* -------------------------RESERVATIONS-------------------------------- */

// Crear checkout de reserva (30% de seña)
export const createReservationCheckoutAxios = (data) => {
    return api.post("/reservation/reserve", data);
}

/* -------------------------PURCHASES-------------------------------- */

// Crear preferencia de compra (carrito simple)
export const createPreferenceAxios = (data) => {
    return api.post("/purchase/create-preference", data);
}

/* -------------------------CATEGORIES-------------------------------- */

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

export const getCategoryAxios = (id) => {
    return api.get(`/getCategory/${id}`);
}

export const editCategoryAxios = (id, data) => {
    return api.patch(`/editCategory/${id}`, data, { headers: { "Content-Type": "multipart/form-data" }});
}

export const deleteCategoryAxios = (id) => {
    return api.delete(`/deleteCategory/${id}`);
}

/* -------------------------CONTACT-------------------------------- */

export const sendContactMessageAxios = (data) => {
    return api.post("/sendContactMessage", data);
}