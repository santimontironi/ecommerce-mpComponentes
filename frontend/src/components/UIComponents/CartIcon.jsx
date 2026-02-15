import { useContext } from "react"
import { ContextCart } from "../../context/CartContext"
import { Link } from "react-router-dom";

export const CartIcon = () => {
    const { getCartCount } = useContext(ContextCart);

    return (
        <Link to={'/carrito'}>
            <div className="relative cursor-pointer group">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />

                <div className="relative bg-linear-to-br from-slate-800 to-slate-900 border border-cyan-400/30 rounded-xl p-3 sm:p-3 shadow-lg">
                    <svg
                        className="w-6 h-6 sm:w-6 sm:h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>

                    {getCartCount() > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-linear-to-br from-red-500 to-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-slate-900">
                            {getCartCount()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CartIcon