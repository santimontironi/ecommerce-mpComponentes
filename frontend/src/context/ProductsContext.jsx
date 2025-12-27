import { createContext, useState } from "react";
import { getAllProductsAdminAxios, getAllProductsAxios, addProductAxios, deleteProductAxios, editProductAxios } from "../api/api";
import { useContext } from "react";
import { ContextAdmin } from "./AdminContext";

export const ContextProducts = createContext();

export const ProductsProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [loadingGetProducts, setLoadingGetProducts] = useState(true);
    const [loadingAddProduct, setLoadingAddProduct] = useState(false);
    const [loadingDeleteProduct, setLoadingDeleteProduct] = useState(false);
    const [loadingEditProduct, setLoadingEditProduct] = useState(false);

    const { isAdmin } = useContext(ContextAdmin);

    async function getProducts(categoryId) {
        try {
            const res = isAdmin ? await getAllProductsAdminAxios(categoryId) : await getAllProductsAxios(categoryId)
            setProducts(res.data.products)
        }
        catch (error) {
            throw error
        }
        finally {
            setTimeout(() => {
                setLoadingGetProducts(false);
            }, 2000)
        }
    }
    
    async function addProduct(data) {
        setLoadingAddProduct(true);
        try {
            const productAdded = await addProductAxios(data)
            setProducts((prev) => [...prev, productAdded.data.product])
            return productAdded.data
        }
        catch (error) {
            throw error
        }
        finally {
            setTimeout(() => {
                setLoadingAddProduct(false);
            }, 2000)
        }
    }

    async function deleteProduct(id){
        setLoadingDeleteProduct(true);
        try{
            await deleteProductAxios(id)
            setProducts((prev) => prev.filter((product) => product._id !== id));
        }
        catch(error){
            throw error
        }
        finally{
            setTimeout(() => {
                setLoadingDeleteProduct(false);
            }, 2000)
        }
    }

    async function editProduct(id, data) {
        setLoadingEditProduct(true);
        try {
            const productEdited = await editProductAxios(id, data)
            setProducts((prev) => prev.map((product) => product._id === id ? productEdited.data.product : product))
            return productEdited.data
        }
        catch (error) {
            throw error
        }
        finally {
            setTimeout(() => {
                setLoadingEditProduct(false);
            }, 2000)
        }
    }

    return <ContextProducts.Provider value={{ products, loadingGetProducts, loadingAddProduct, addProduct, getProducts, deleteProduct, loadingDeleteProduct, editProduct, loadingEditProduct }}>
        {children}
    </ContextProducts.Provider>;
};