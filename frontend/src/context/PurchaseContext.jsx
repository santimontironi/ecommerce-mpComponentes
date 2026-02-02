import { createContext, useState, useContext } from "react";
import { createPreferenceAxios } from "../api/api";
import { ContextCart } from "./CartContext";

export const ContextPurchase = createContext();

export const PurchaseProvider = ({ children }) => {

    const { cart, clearCart } = useContext(ContextCart);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Crear preferencia de compra
    const createPreference = async (buyerEmail, buyerPhone) => {
        setLoading(true);
        setError(null);

        try {
            // Mapear cada ítem del carrito individualmente
            const items = cart.map(item => ({
                title: item.name,
                quantity: item.quantity,
                unit_price: item.price
            }));

            const response = await createPreferenceAxios({
                items,           // ← ahora mandas el array de ítems
                buyer_email: buyerEmail,
                buyer_phone: buyerPhone
            });

            if (response.data.init_point) {
                window.location.href = response.data.init_point;
            }

            return response.data;

        } catch (err) {
            console.error("Error al crear preferencia:", err);
            setError(err.response?.data?.error || "Error al procesar la compra");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Confirmar compra exitosa (llamar desde página de éxito)
    const confirmPurchase = () => {
        clearCart();
        setError(null);
    };

    // Limpiar error
    const resetError = () => {
        setError(null);
    };

    return (
        <ContextPurchase.Provider value={{
            createPreference,
            confirmPurchase,
            resetError,
            loading,
            error
        }}>
            {children}
        </ContextPurchase.Provider>
    );
};
