import { createContext, useState } from "react";
import { createReservationCheckoutAxios } from "../api/api";

export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);

    // Crear checkout de reserva (formulario → Stripe - Pagar 30% de seña)
    const createReservationCheckout = async (reservationData) => {
        try {
            setLoading(true);
            const response = await createReservationCheckoutAxios(reservationData);
            return response.data; // { url, sessionId }
        } catch (error) {
            console.error('Error al crear checkout de reserva:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Calcular seña (30%) para mostrar en UI
    const calculateDeposit = (totalAmount) => {
        return Math.round(totalAmount * 0.30);
    }

    // Calcular saldo restante (70%)
    const calculateRemaining = (totalAmount) => {
        return Math.round(totalAmount * 0.70);
    }

    return (
        <ReservationContext.Provider value={{
            loading,
            createReservationCheckout,
            calculateDeposit,
            calculateRemaining
        }}>
            {children}
        </ReservationContext.Provider>
    )
}
