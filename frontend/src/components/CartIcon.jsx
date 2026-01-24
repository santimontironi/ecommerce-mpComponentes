import { useContext } from "react"
import { ContextCart } from "../context/CartContext"
import { Link } from "react-router-dom";

const CartIcon = () => {
    const { getCartCount } = useContext(ContextCart);

    return (
        <Link to={'/carrito'}>
            <div className="relative cursor-pointer group">
                <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white hover:text-cyan-400 transition-all duration-300 group-hover:scale-110"
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
                    <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                        {getCartCount()}
                    </span>
                )}
            </div>
        </Link>
    )
}

export default CartIcon