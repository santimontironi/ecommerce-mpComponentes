import { createContext, useState } from "react";
import { getAllProductsAxios, addProductAxios, deleteProductAxios } from "../api/api";

export const ContextProducts = createContext();

export const ProductsProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [loadingGetProducts, setLoadingGetProducts] = useState(true);
    const [loadingAddProduct, setLoadingAddProduct] = useState(false);
    const [loadingDeleteProduct, setLoadingDeleteProduct] = useState(false);

    async function getProducts(categoryId) {
        try {
            const res = await getAllProductsAxios(categoryId)
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

    return <ContextProducts.Provider value={{ products, loadingGetProducts, loadingAddProduct, addProduct, getProducts, deleteProduct, loadingDeleteProduct }}>
        {children}
    </ContextProducts.Provider>;
};