import { createContext, useState, useEffect } from "react";
import { addCategoryAxios, getAllCategoriesAxios, deleteCategoryAxios } from "../api/api";

export const ContextProducts = createContext();

export const CategoryProvider = ({ children }) => {

    const[categories,setCategories] = useState([]);
    const[loadingGetCategories,setLoadingGetCategories] = useState(true);
    const[loadingAddCategory,setLoadingAddCategory] = useState(false);

    useEffect(() => {
        async function getCategories() {
            try {
                const res = await getAllCategoriesAxios();
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
        getCategories();
    }, []);

    async function addCategory(data) {
        setLoadingAddCategory(true);
        try {
            const categoryAdded = await addCategoryAxios(data);
            setCategories((prev) => [...prev, categoryAdded.data.category]);
        } catch (error) {
            throw error;
        }
        finally{
            setTimeout(() => {
                setLoadingAddCategory(false);
            },2000)
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


    return <ContextProducts.Provider value={{addCategory,categories,loadingGetCategories,loadingAddCategory,deleteCategory}}>
        {children}
    </ContextProducts.Provider>
};