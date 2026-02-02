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
            // Calcular total del carrito
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Crear título descriptivo
            const title = cart.length === 1 
                ? cart[0].name 
                : `Compra de ${cart.length} productos`;

            // Llamar al endpoint para crear la preferencia
            const response = await createPreferenceAxios({ 
                title,
                unit_price: total,
                quantity: 1,
                buyer_email: buyerEmail,
                buyer_phone: buyerPhone
            });

            // Redirigir a la URL de pago de MercadoPago
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
