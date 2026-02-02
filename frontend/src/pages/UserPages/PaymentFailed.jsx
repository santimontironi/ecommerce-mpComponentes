import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-10 max-w-lg">
                <h1 className="text-red-900 text-4xl font-bold mb-5">
                    ❌ Pago cancelado
                </h1>
                <p className="text-xl mb-4">
                    Tu pago no se ha completado.
                </p>
                <p className="mb-8 text-gray-600">
                    No se realizó ningún cargo. Puedes intentarlo nuevamente cuando quieras.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <button 
                        onClick={() => navigate('/carrito')}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-base transition-colors"
                    >
                        Volver al carrito
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-base transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
