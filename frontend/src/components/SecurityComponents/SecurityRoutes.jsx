import { useContext } from "react";
import { ContextAdmin } from "../../context/adminContext";
import { Loader } from "../UIComponents/Loader";
import { Navigate } from "react-router-dom";

export const SecurityRoutes = ({children}) => {

    const {admin, loading} = useContext(ContextAdmin);

    if(loading){
        return <Loader/>
    }

    if(!admin){
        return <Navigate to="/ingresar"/>
    }

    return children
}

export default SecurityRoutes
