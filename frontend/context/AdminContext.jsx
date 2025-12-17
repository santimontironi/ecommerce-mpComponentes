import { createContext, useState } from "react";
import { loginAdminAxios } from "../api/api";
import { Outlet } from "react-router-dom";

export const contextAdmin = createContext();

const AdminProvider = ({ children }) => {

    const [admin, setAdmin] = useState(null);
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


    return <contextAdmin.Provider value={{loadingLogin, loginAdmin, admin}}>
        <Outlet />
    </contextAdmin.Provider>;
};

export default AdminProvider
