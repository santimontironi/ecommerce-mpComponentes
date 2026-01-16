import { createContext, useState, useEffect } from "react";
import { getAllCategoriesAxios,addCategoryAxios, getAllCategoriesWithoutParentsAxios, deleteCategoryAxios, getSubCategoriesAxios } from "../api/api";

export const ContextCategories = createContext();

const CategoriesProvider = ({ children }) => {

    const[allCategories, setAllCategories] = useState([]);
    const[categories,setCategories] = useState([]);
    const[subcategories, setSubcategories] = useState([]);
    
    const[loadingGetCategories,setLoadingGetCategories] = useState(true);
    const[loadingAddCategory,setLoadingAddCategory] = useState(false);
    const[loadingGetSubCategories,setLoadingGetSubCategories] = useState(false);

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
            finally{
                setTimeout(() => {
                    setLoadingGetCategories(false);
                },2000)
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
        finally{
            setLoadingGetSubCategories(false);
        }
    }

    async function addCategory(data) {
        setLoadingAddCategory(true);
        try {
            const categoryAdded = await addCategoryAxios(data);
            const newCategory = categoryAdded.data.category;
            if(!newCategory.parent){
                setCategories((prev) => [...prev, categoryAdded.data.category]);
            }
            else{
                setSubcategories((prev) => [...prev, categoryAdded.data.category]);
            }
        } catch (error) {
            throw error;
        }
        finally{
            setLoadingAddCategory(false);
        }
    }

    async function deleteCategory(id){
        try{
            await deleteCategoryAxios(id)
            setCategories((prev) => prev.filter((category) => category._id !== id));
        }
        catch(error){
            throw error
        }
    }


    return <ContextCategories.Provider value={{getAllCategories, allCategories, addCategory,categories,loadingGetCategories,loadingAddCategory,deleteCategory, getSubCategories, loadingGetSubCategories, subcategories}}>
        {children}
    </ContextCategories.Provider>
};

export default CategoriesProvider;