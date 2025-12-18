import { createContext, useEffect, useState } from "react";
import { loginAdminAxios, dashboardAdminAxios } from "../api/api";
import { Outlet } from "react-router-dom";

export const ContextAdmin = createContext();

const AdminProvider = () => {

    const [admin, setAdmin] = useState(null);
    const [loading,setLoading] = useState(true)
    const [loadingLogin,setLoadingLogin] = useState(false);

    async function loginAdmin(data){
        setLoadingLogin(true);
        try{
            const res = await loginAdminAxios(data)
            setAdmin(res.data.admin)
        }
        catch(error){
            console.log("Error al iniciar sesión", error);
        }
        finally{
            setTimeout(() => {
                setLoadingLogin(false);
            },2000)
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
                }
            }
            catch(error){
                console.log("Error al obtener el dashboard", error);
            }
            finally{
                setTimeout(() => {
                    setLoading(false);
                },2000)
            }
        }

        getDashboard();
    })


    return <ContextAdmin.Provider value={{loadingLogin, loginAdmin, admin, loading}}>
        <Outlet />
    </ContextAdmin.Provider>;
};

export default AdminProvider
