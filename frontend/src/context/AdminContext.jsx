import { createContext, useEffect, useState } from "react";
import { loginAdminAxios, dashboardAdminAxios, logoutAdminAxios } from "../api/api";

export const ContextAdmin = createContext();

const AdminProvider = ({children}) => {

    const [admin, setAdmin] = useState(null);
    const [loading,setLoading] = useState(true)
    const [loadingLogin,setLoadingLogin] = useState(false);

    const isAdmin = admin ? true : false

    async function loginAdmin(data){
        setLoadingLogin(true);
        try{
            const res = await loginAdminAxios(data)
            setAdmin(res.data.admin)
            return res.data
        }
        catch(error){
            throw error
        }
        finally{
            setLoadingLogin(false);
        }
    }

    useEffect(() => {
        async function getDashboard(){
            try{
                const res = await dashboardAdminAxios()
                if(res.data.authorized === false){
                    setAdmin(null)
                }else{
                    setAdmin(res.data.admin)
                    return res.data
                }
            }
            finally{
                setLoading(false);
            }
        }

        getDashboard();
    },[])

    async function logoutAdmin () {
        try {
            await logoutAdminAxios()
            setAdmin(null)
        } catch (error) {
            throw error
        }
    }


    return <ContextAdmin.Provider value={{loadingLogin, loginAdmin, admin, loading, logoutAdmin, isAdmin}}>
        {children}
    </ContextAdmin.Provider>;
};

export default AdminProvider
