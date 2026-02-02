import { createContext, useState, useContext } from "react";
import { createCheckoutAxios } from "../api/api";
import { ContextCart } from "./CartContext";

export const ContextPurchase = createContext();

export const PurchaseProvider = ({ children }) => {

    const { cart, clearCart } = useContext(ContextCart);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Crear checkout de compra
    const createCheckout = async (buyerEmail, buyerPhone) => {
        setLoading(true);
        setError(null);
        
        try {
            // Preparar los items del carrito para el backend
            const items = cart.map(item => ({
                product_id: item._id,
                quantity: item.quantity
            }));

            // Llamar al endpoint para crear la sesión de checkout
            const response = await createCheckoutAxios({ 
                items, 
                buyer_email: buyerEmail,
                buyer_phone: buyerPhone
            });

            // Redirigir a la URL de pago de Stripe
            if (response.data.url) {
                window.location.href = response.data.url;
            }

            return response.data;
            
        } catch (err) {
            console.error("Error al crear checkout:", err);
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
            createCheckout,
            confirmPurchase,
            resetError,
            loading, 
            error
        }}>
            {children}
        </ContextPurchase.Provider>
    );
};
