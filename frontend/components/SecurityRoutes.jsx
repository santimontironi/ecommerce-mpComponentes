import { useContext } from "react";
import { ContextAdmin } from "../context/adminContext";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const SecurityRoutes = ({children}) => {

    const {admin, loading} = useContext(ContextAdmin);

    const navigate = useNavigate();

    if(!admin){
        navigate("/login")
    }

    if(loading){
        return <Loader/>
    }

    return (
        {children}
    )
}

export default SecurityRoutes