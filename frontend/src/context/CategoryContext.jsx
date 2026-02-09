import { createContext, useState, useEffect } from "react";
import { getAllCategoriesAxios, addCategoryAxios, getAllCategoriesWithoutParentsAxios, deleteCategoryAxios, getSubCategoriesAxios, editCategoryAxios, getCategoryAxios } from "../api/api";

export const ContextCategories = createContext();

const CategoriesProvider = ({ children }) => {

    const [allCategories, setAllCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [category, setCategory] = useState([]);

    const [loading, setLoading] = useState({
        loadingGetCategories: true,
        loadingAddCategory: false,
        loadingEditCategory: false,
        loadingGetSubCategories: false
    });

    async function getAllCategories() {
        try {
            const res = await getAllCategoriesAxios();
            setAllCategories(res.data.categories);
        }
        catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        async function getCategoriesWithoutParents() {
            try {
                const res = await getAllCategoriesWithoutParentsAxios();
                setCategories(res.data.categories);
            } catch (error) {
                throw error;
            }
            finally {
                setTimeout(() => {
                    setLoading((prev) => ({ ...prev, loadingGetCategories: false }));
                }, 2000)
            }
        }
        getCategoriesWithoutParents();
    }, []);

    async function getSubCategories(id) {
        try {
            const res = await getSubCategoriesAxios(id);
            setSubcategories(res.data.categories);
            return res.data.categories;
        } catch (error) {
            throw error;
        }
        finally {
            setLoading((prev) => ({ ...prev, loadingGetSubCategories: false }));
        }
    }

    async function getCategory(id) {
        try {
            const res = await getCategoryAxios(id);
            setCategory(res.data.category);
            return res.data.category;
        } catch (error) {
            throw error;
        }
    }

    async function addCategory(data) {
        setLoading((prev) => ({ ...prev, loadingAddCategory: true }));
        try {
            const categoryAdded = await addCategoryAxios(data);
            const newCategory = categoryAdded.data.category;
            if (!newCategory.categoryParent) {
                setCategories((prev) => [...prev, categoryAdded.data.category]);
            }
            else {
                setSubcategories((prev) => [...prev, categoryAdded.data.category]);
            }
        } catch (error) {
            throw error;
        }
        finally {
            setLoading((prev) => ({ ...prev, loadingAddCategory: false }));
        }
    }

    async function editCategory(id, data) {
        setLoading((prev) => ({ ...prev, loadingEditCategory: true }));
        try {
            const categoryUpdated = await editCategoryAxios(id, data);
            const updatedCategory = categoryUpdated.data.category;

            // Actualizar en todos los arrays (solo se modificará donde exista)
            setAllCategories((prev) =>
                prev.map((cat) => cat._id === id ? updatedCategory : cat)
            );
            setCategories((prev) =>
                prev.map((cat) => cat._id === id ? updatedCategory : cat)
            );
            setSubcategories((prev) =>
                prev.map((cat) => cat._id === id ? updatedCategory : cat)
            );
        } catch (error) {
            throw error;
        } finally {
            setLoading((prev) => ({ ...prev, loadingEditCategory: false }));
        }
    }

    async function deleteCategory(id) {
        try {
            await deleteCategoryAxios(id)
            setCategories((prev) => prev.filter((category) => category._id !== id));
            setSubcategories((prev) => prev.filter((category) => category._id !== id));
        }
        catch (error) {
            throw error
        }
    }


    return <ContextCategories.Provider value={{ getAllCategories, allCategories, getCategory, category, addCategory, editCategory, categories, loading, setLoading, deleteCategory, getSubCategories, subcategories }}>
        {children}
    </ContextCategories.Provider>
};

export default CategoriesProvider;