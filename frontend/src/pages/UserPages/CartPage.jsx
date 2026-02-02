import { useContext, useState } from "react"
import { ContextCart } from "../../context/CartContext"
import { ContextPurchase } from "../../context/PurchaseContext"
import { Link, useNavigate } from "react-router-dom"

const CartPage = () => {
    const { cart, removeProductFromCart, incrementQuantity, decreaseQuantity, getCartMoney, clearCart } = useContext(ContextCart);
    const { createCheckout, loading, error } = useContext(ContextPurchase);
    const navigate = useNavigate();
    
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [buyerEmail, setBuyerEmail] = useState("");
    const [buyerPhone, setBuyerPhone] = useState("");

    const handleProceedToCheckout = async (e) => {
        e.preventDefault();
        
        if (!buyerEmail || !buyerPhone) {
            alert("Por favor completa todos los campos");
            return;
        }

        try {
            await createCheckout(buyerEmail, buyerPhone);
        } catch (err) {
            alert(error || "Error al procesar la compra");
        }
    };

    return (
        <section className="relative w-full overflow-hidden min-h-screen bg-linear-to-br from-[#0a0a0a] via-[#001b48] to-[#002855] py-12 px-4 sm:px-6 lg:px-8">

            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-20 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Carrito de Compras</h1>
                        <p className="text-blue-100">
                            {cart.length === 0 ? "Tu carrito está vacío" : `${cart.length} producto${cart.length !== 1 ? 's' : ''} en tu carrito`}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r cursor-pointer from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg border border-slate-600/50"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Volver</span>
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-blue-100 to-blue-200 mb-6">
                            <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Tu carrito está vacío</h2>
                        <p className="text-slate-600 mb-6">Agrega productos para comenzar tu compra</p>
                        <Link to="/" className="inline-block bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg">
                            Explorar Productos
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6">
                                    <div className="flex gap-6">
                                        <div className="w-32 h-32 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden shrink-0">
                                            <img
                                                src={item.image || "/placeholder.png"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="grow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-600">
                                                        {item.description || "Producto de calidad"}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeProductFromCart(item._id)}
                                                    className="text-red-500 hover:text-red-700 cursor-pointer hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                                                    aria-label="Eliminar producto"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-1">
                                                    <button
                                                        onClick={() => decreaseQuantity(item._id)}
                                                        className="w-8 h-8 flex items-center cursor-pointer justify-center bg-white hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white text-slate-700 rounded-md transition-all duration-200 shadow-sm"
                                                        aria-label="Disminuir cantidad"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="w-12 text-center font-semibold text-slate-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => incrementQuantity(item._id)}
                                                        className="w-8 h-8 flex items-center cursor-pointer justify-center bg-white hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white text-slate-700 rounded-md transition-all duration-200 shadow-sm"
                                                        aria-label="Aumentar cantidad"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        ${item.price} c/u
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={clearCart}
                                className="w-full cursor-pointer bg-white hover:bg-linear-to-r hover:from-red-50 hover:to-red-100 text-slate-700 hover:text-red-600 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Vaciar Carrito
                            </button>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-2xl p-6 sticky top-6">
                                <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-6 pb-4 border-b border-blue-100">
                                    Resumen del Pedido
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${getCartMoney().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Envío</span>
                                        <span className="font-semibold text-green-600">Gratis</span>
                                    </div>
                                    <div className="border-t border-blue-100 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-slate-900">Total</span>
                                            <span className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                                ${getCartMoney().toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setShowCheckoutModal(true)}
                                    disabled={loading}
                                    className="w-full cursor-pointer bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Procesando..." : "Proceder al Pago"}
                                </button>

                                <Link to="/" className="block w-full bg-linear-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md text-center">
                                    Continuar Comprando
                                </Link>

                                <div className="mt-6 pt-6 border-t border-blue-100">
                                    <div className="space-y-3 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-blue-700 rounded-full"></div>
                                            <span>Envío seguro y protegido</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-blue-700 rounded-full"></div>
                                            <span>Garantía de devolución</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-linear-to-r from-blue-600 to-blue-700 rounded-full"></div>
                                            <span>Pago 100% seguro</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                        <button
                            onClick={() => setShowCheckoutModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Finalizar Compra</h2>
                        <p className="text-slate-600 mb-6">Ingresa tus datos para continuar</p>

                        <form onSubmit={handleProceedToCheckout} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={buyerEmail}
                                    onChange={(e) => setBuyerEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={buyerPhone}
                                    onChange={(e) => setBuyerPhone(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+54 11 1234-5678"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="pt-4 space-y-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {loading ? "Procesando..." : "Continuar al Pago"}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setShowCheckoutModal(false)}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg transition-all duration-200 cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default CartPage