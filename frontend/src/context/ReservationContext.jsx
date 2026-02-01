import { createContext, useState } from "react";
import { createReservationCheckoutAxios, getUserReservationsAxios, cancelReservationAxios } from "../api/api";

export const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {

    // Estado para reservas del usuario (consultadas desde backend)
    const [userReservations, setUserReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    // Crear checkout de reserva (formulario → Stripe)
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

    // Obtener reservas del usuario por email
    const fetchUserReservations = async (userEmail) => {
        try {
            setLoading(true);
            const response = await getUserReservationsAxios(userEmail);
            setUserReservations(response.data);
            return response.data;
        } catch (error) {
            console.error('Error al obtener reservas:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Cancelar una reserva
    const cancelReservation = async (reservationId) => {
        try {
            setLoading(true);
            await cancelReservationAxios(reservationId);
            // Actualizar estado local
            setUserReservations(userReservations.filter(r => r._id !== reservationId));
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Calcular seña (30%) para mostrar en UI
    const calculateDeposit = (totalAmount) => {
        return totalAmount * 0.30;
    }

    // Calcular saldo restante (70%)
    const calculateRemaining = (totalAmount) => {
        return totalAmount * 0.70;
    }

    return (
        <ReservationContext.Provider value={{
            // Estados
            userReservations,
            loading,
            // Funciones principales
            createReservationCheckout,
            fetchUserReservations,
            cancelReservation,
            // Utilidades
            calculateDeposit,
            calculateRemaining
        }}>
            {children}
        </ReservationContext.Provider>
    )
}
