import { createContext, useState, useEffect } from "react";
import { getProductsAdminAxios, getAllProductsAxios, getProductsAxios, addProductAxios, deleteProductAxios, editProductAxios, getProductAxios, getProductAdminAxios, importProductsAxios, getProductsWithoutStockAxios } from "../api/api";
import { useContext } from "react";
import { ContextAdmin } from "./adminContext";

export const ContextProducts = createContext();

export const ProductsProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [productsFilter, setProductsFilter] = useState(null);
    const [productById, setProductById] = useState([]);
    const [productsWithoutStock, setProductsWithoutStock] = useState([]);

    const [loadingGetProducts, setLoadingGetProducts] = useState(true);
    const [loadingAddProduct, setLoadingAddProduct] = useState(false);
    const [loadingEditProduct, setLoadingEditProduct] = useState(false);
    const [loadingGetProduct, setLoadingGetProduct] = useState(false);
    const [loadingImportProducts, setLoadingImportProducts] = useState(false);
    const [loadingProductsFilter, setLoadingProductsFilter] = useState(false);

    const { isAdmin } = useContext(ContextAdmin);

    useEffect(() => {
        async function getProducts() {
            try {
                const res = await getAllProductsAxios()
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
        getProducts()
    },[])

    async function getProducts(categoryId) {
        try {
            const res = isAdmin ? await getProductsAdminAxios(categoryId) : await getProductsAxios(categoryId)
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

    async function importProducts(data) {
        setLoadingImportProducts(true);
        try {

            const result = await importProductsAxios(data)

            if (result.data.detalles && result.data.detalles.success) {
                setProducts((prev) => [...prev, ...result.data.products])
            }
        }
        catch (error) {
            throw error
        }
        finally {
            setTimeout(() => {
                setLoadingImportProducts(false);
            }, 2000)
        }
    }

    async function deleteProduct(id) {
        try {
            await deleteProductAxios(id)
            setProducts((prev) => prev.filter((product) => product._id !== id));
        }
        catch (error) {
            throw error
        }
    }

    async function getProduct(id) {
        setLoadingGetProduct(true);
        try {
            const res = isAdmin ? await getProductAdminAxios(id) : await getProductAxios(id)
            setProductById(res.data.product)
            return res.data
        }
        catch (error) {
            throw error
        }
        finally {
            setTimeout(() => {
                setLoadingGetProduct(false);
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

    async function getProductsWithoutStock() {
        try {
            const res = await getProductsWithoutStockAxios()
            setProductsWithoutStock(res.data.products)
        }
        catch (error) {
            throw error
        }
    }

    async function searchProducts(name) {
        setProductsFilter(true)
        try {

            if (!name.trim()) {
                setProductsFilter(null)
                return
            }

            const productsFiltered = products.filter(product => product.name.toLowerCase().includes(name.toLowerCase()))
            setProductsFilter(productsFiltered)

            return productsFiltered
        }
        catch (error) {
            console.log(error)
            throw error
        }
        finally {
            setLoadingProductsFilter(false)
        }
    }

    return <ContextProducts.Provider value={{ products, loadingGetProducts, loadingAddProduct, addProduct, getProducts, deleteProduct, editProduct, loadingEditProduct, getProduct, loadingGetProduct, productById, loadingImportProducts, importProducts, productsWithoutStock, getProductsWithoutStock, productsFilter, searchProducts, loadingProductsFilter }}>
        {children}
    </ContextProducts.Provider>;
};