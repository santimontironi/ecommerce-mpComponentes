import { createContext, useEffect, useState } from "react";
import { getAllProductsAxios, addProductAxios } from "../api/api";

export const ContextProducts = createContext();

export const ProductsProvider = ({ children }) => {

    const[products, setProducts] = useState([]);
    const[loadingGetProducts, setLoadingGetProducts] = useState(true);
    const[loadingAddProduct, setLoadingAddProduct] = useState(false);

    useEffect(() => {
        async function getProducts(){
            try{
                const res = await getAllProductsAxios()
                setProducts(res.data.products)
            }
            catch(error){
                throw error
            }
            finally{
                setTimeout(() => {
                    setLoadingGetProducts(false);
                },2000)
            }
        }

        getProducts()
    }, [])

    async function addProduct(data){
        setLoadingAddProduct(true);
        try{
            const productAdded = await addProductAxios(data)
            setProducts((prev) => [...prev, productAdded.data.product])
            return productAdded.data
        }
        catch(error){
            throw error
        }
        finally{
            setTimeout(() => {
                setLoadingAddProduct(false);
            },2000)
        }
    }

    return <ContextProducts.Provider value={{products, loadingGetProducts, loadingAddProduct, addProduct}}>
        {children}
    </ContextProducts.Provider>;
};