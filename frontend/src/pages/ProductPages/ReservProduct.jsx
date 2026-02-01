import { useContext } from "react"
import { ReservationContext } from "../../context/ReservationContext";
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom";

const ReservProduct = () => {

    const {productId} = useParams()

    const {register, handleSubmit, reset, formState: { errors }} = useForm()

    const { createReservationCheckout } = useContext(ReservationContext)
    
    return (
        <section>
            <div>

            </div>

            <ToastContainer />
        </section>
    )
}

export default ReservProduct