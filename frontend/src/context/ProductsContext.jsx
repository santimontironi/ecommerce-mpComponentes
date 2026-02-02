import { createContext, useState, useEffect } from "react";
import { getProductsAdminAxios, getAllProductsAxios, getProductsAxios, addProductAxios, deleteProductAxios, editProductAxios, getProductAxios, getProductAdminAxios, importProductsAxios, getProductsWithoutStockAxios, orderProductAxios } from "../api/api";
import { useContext } from "react";
import { ContextAdmin } from "./AdminContext";

export const ContextProducts = createContext();

export const ProductsProvider = ({ children }) => {

    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [productsFilter, setProductsFilter] = useState(null);
    const [productById, setProductById] = useState([]);
    const [productsWithoutStock, setProductsWithoutStock] = useState([]);

    const [loading, setLoading] = useState({
        loadingGetProducts: true,
        loadingAddProduct: false,
        loadingEditProduct: false,
        loadingGetProduct: false,
        loadingImportProducts: false,
        loadingProductsFilter: false,
        loadingOrderProduct: false
    })

    const { isAdmin } = useContext(ContextAdmin);

    useEffect(() => {
        async function getProducts() {
            try {
                const res = await getAllProductsAxios()
                setAllProducts(res.data.products)
            }
            catch (error) {
                throw error
            }
            finally {
                setTimeout(() => {
                    setLoading((prev) => ({ ...prev, loadingGetProducts: false }));
                }, 2000)
            }
        }
        getProducts()
    },[])

    async function getProducts(categoryId) {
        setLoading((prev) => ({ ...prev, loadingGetProducts: true }));
        setProducts([]);
        try {
            const res = isAdmin ? await getProductsAdminAxios(categoryId) : await getProductsAxios(categoryId)
            setProducts(res.data.products)
        }
        catch (error) {
            throw error
        }
        finally {
            setTimeout(() => {
                setLoading((prev) => ({ ...prev, loadingGetProducts: false }));
            }, 2000)
        }
    }

    async function addProduct(data) {
        setLoading((prev) => ({ ...prev, loadingAddProduct: true }));
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
                setLoading((prev) => ({ ...prev, loadingAddProduct: false }));
            }, 2000)
        }
    }

    async function importProducts(data) {
        setLoading((prev) => ({ ...prev, loadingImportProducts: true }));
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
                setLoading((prev) => ({ ...prev, loadingImportProducts: false }));
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
        setLoading((prev) => ({ ...prev, loadingGetProduct: true }));
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
                setLoading((prev) => ({ ...prev, loadingGetProduct: false }));
            }, 2000)
        }
    }

    async function editProduct(id, data) {
        setLoading((prev) => ({ ...prev, loadingEditProduct: true }));
        try {
            const productEdited = await editProductAxios(id, data)
            setProducts((prev) => prev.map((product) => product._id === id ? productEdited.data.product : product))

            setProductById(productEdited.data.product)
            return productEdited.data
        }
        catch (error) {
            throw error
        }
        finally {
            setTimeout(() => {
                setLoading((prev) => ({ ...prev, loadingEditProduct: false }));
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
        setLoading((prev) => ({ ...prev, loadingProductsFilter: true }))
        try {

            if (!name.trim()) {
                setProductsFilter(null)
                return
            }

            const productsFiltered = allProducts.filter(product => product.name.toLowerCase().startsWith(name.toLowerCase()))
            setProductsFilter(productsFiltered)

            return productsFiltered
        }
        catch (error) {
            console.log(error)
            throw error
        }
        finally {
            setLoading((prev) => ({ ...prev, loadingProductsFilter: false }))
        }
    }

    async function orderProduct(data){
        setLoading((prev) => ({ ...prev, loadingOrderProduct: true }));
        try {
            const res = await orderProductAxios(data)
            return res.data
        }
        catch (error) {
            throw error
        }
        finally {
            setLoading((prev) => ({ ...prev, loadingOrderProduct: false }));
        }
    }

    return <ContextProducts.Provider value={{ products, allProducts, loading, setLoading, addProduct, getProducts, deleteProduct, editProduct, getProduct, productById, importProducts, productsWithoutStock, getProductsWithoutStock, productsFilter, searchProducts, orderProduct}}>
        {children}
    </ContextProducts.Provider>;
};