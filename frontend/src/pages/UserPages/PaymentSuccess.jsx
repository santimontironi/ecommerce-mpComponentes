import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ContextPurchase } from "../../context/PurchaseContext";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { confirmPurchase } = useContext(ContextPurchase);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // Limpiar el carrito cuando se confirma el pago
        if (sessionId) {
            confirmPurchase();
        }
    }, [sessionId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-10 max-w-lg">
                <h1 className="text-green-800 text-4xl font-bold mb-5">
                    ✅ ¡Pago exitoso!
                </h1>
                <p className="text-xl mb-4">
                    Tu compra se ha procesado correctamente.
                </p>
                <p className="mb-8 text-gray-600">
                    Recibirás un email de confirmación con los detalles de tu compra.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-base transition-colors"
                    >
                        Volver al inicio
                    </button>
                    <button 
                        onClick={() => navigate('/productos')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base transition-colors"
                    >
                        Seguir comprando
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
