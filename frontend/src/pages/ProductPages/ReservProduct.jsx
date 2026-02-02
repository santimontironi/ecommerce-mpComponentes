import { useContext, useEffect, useState } from "react"
import { ReservationContext } from "../../context/ReservationContext"
import { ContextProducts } from "../../context/ProductsContext"
import { ToastContainer, toast } from 'react-toastify'
import { useForm } from "react-hook-form"
import { useParams, useNavigate } from "react-router-dom"
import { Loader } from "../../components/UIComponents/Loader"

const ReservProduct = () => {

    const { productId } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    const { createReservationCheckout, calculateDeposit, calculateRemaining, loading: reservationLoading } = useContext(ReservationContext)
    const { getProduct, productById, loading } = useContext(ContextProducts)

    const [totalAmount, setTotalAmount] = useState(0)
    const quantity = watch("quantity", 1)

    useEffect(() => {
        if (productId) {
            getProduct(productId)
        }
    }, [productId])

    useEffect(() => {
        if (productById.price && quantity) {
            setTotalAmount(productById.price * quantity)
        }
    }, [productById.price, quantity])

    const onSubmit = async (data) => {
        try {
            const reservationData = {
                items: [{
                    product_id: productId,
                    quantity: parseInt(data.quantity)
                }],
                buyer_email: data.email,
                buyer_phone: data.phone
            }

            const response = await createReservationCheckout(reservationData)

            if (response.url) {
                window.location.href = response.url // Redirigir a la página de MercadoPago
            }
        } catch (error) {
            console.error('Error al crear reserva:', error)
            toast.error('Error al procesar la reserva. Intenta nuevamente.')
        }
    }

    return (
        <section className="min-h-screen w-full bg-linear-to-br flex justify-center items-center from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
            {loading.loadingGetProducts ? <Loader /> : (

                <div className="max-w-5xl mx-auto">

                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 cursor-pointer text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>

                    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/30 rounded-3xl overflow-hidden shadow-2xl">

                        <div className="bg-linear-to-r from-blue-600/20 to-cyan-500/20 border-b border-slate-700/30 p-6">
                            <h1 className="text-3xl font-bold text-white mb-2">Reservar Producto</h1>
                            <p className="text-slate-300">Completa el formulario para reservar tu producto con una seña del 30%</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

                            <div className="space-y-6">
                                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30">
                                    <h2 className="text-xl font-semibold text-white mb-4">Producto a Reservar</h2>

                                    <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden mb-4">
                                        <img
                                            src={productById.image}
                                            alt={productById.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">{productById.name}</h3>
                                    <p className="text-slate-300 mb-4">{productById.description}</p>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                            ${productById.price}
                                        </span>
                                        <span className="text-slate-400">por unidad</span>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                        <p className="text-sm text-blue-300">
                                            <span className="font-semibold">Stock disponible:</span> {productById.stock} unidades
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            {...register("email", {
                                                required: "El email es obligatorio",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Email inválido"
                                                }
                                            })}
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="tu@email.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            {...register("phone", {
                                                required: "El teléfono es obligatorio",
                                                pattern: {
                                                    value: /^[0-9+\s()-]{8,}$/,
                                                    message: "Teléfono inválido"
                                                }
                                            })}
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="+54 9 11 1234-5678"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Cantidad *
                                        </label>
                                        <input
                                            type="number"
                                            {...register("quantity", {
                                                required: "La cantidad es obligatoria",
                                                min: { value: 1, message: "Mínimo 1 unidad" },
                                                max: { value: productById.stock, message: `Máximo ${productById.stock} unidades disponibles` }
                                            })}
                                            defaultValue={1}
                                            min={1}
                                            max={productById.stock}
                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        {errors.quantity && (
                                            <p className="mt-1 text-sm text-red-400">{errors.quantity.message}</p>
                                        )}
                                    </div>

                                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30 space-y-3">
                                        <h3 className="text-lg font-semibold text-white mb-4">Resumen de Reserva</h3>

                                        <div className="flex justify-between text-slate-300">
                                            <span>Subtotal</span>
                                            <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                                        </div>

                                        <div className="border-t border-slate-700/50 pt-3">
                                            <div className="flex justify-between text-slate-300 mb-2">
                                                <span>Seña a pagar (30%)</span>
                                                <span className="font-semibold text-blue-400">
                                                    ${calculateDeposit(totalAmount).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-slate-400 text-sm">
                                                <span>Saldo restante (70%)</span>
                                                <span>${calculateRemaining(totalAmount).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-4">
                                            <p className="text-xs text-blue-300">
                                                📌 <strong>¿Cómo funciona?</strong> Pagas el 30% de seña ahora para reservar el producto. 
                                                El 70% restante se coordina por WhatsApp cuando el producto esté listo para ser entregado.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={reservationLoading}
                                        className="w-full py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {reservationLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                Pagar Seña y Reservar
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                theme="dark"
            />
        </section>
    )
}

export default ReservProduct