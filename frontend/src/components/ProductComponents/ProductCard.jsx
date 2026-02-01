import { Link } from "react-router-dom"

export const ProductCard = ({ product, isAdmin, handleDelete, addProductToCart }) => {

    return (
        <section className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl transition-all duration-300 hover:outline-1 hover:outline-white hover:scale-105">

            <Link target="_blank" to={`/producto/${product._id}`}>
                <div className="relative w-full h-56 bg-slate-950 overflow-hidden">

                    <img
                        src={product.image}
                        alt={`Imagen del producto ${product.name}`}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
                </div>
            </Link>

            <div className="p-5 space-y-3">
                <h2 className="text-lg font-semibold text-white line-clamp-1">
                    {product.name}
                </h2>

                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                <div className="pt-3 flex items-start gap-4 flex-col border-t border-slate-700/30">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium">Precio</span>
                        <span className="text-xl font-bold text-blue-400">
                            ${product.price}
                        </span>
                    </div>

                    {!isAdmin ? (
                        <div className="flex items-center gap-4">
                            <button onClick={() => addProductToCart(product)} className="px-2 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors duration-200 active:scale-95 text-sm">
                                Agregar al carrito
                            </button>
                            <Link to={`/reservar/${product._id}`} className="px-2 py-2.5 cursor-pointer bg-green-700 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors duration-200 active:scale-95 text-sm text-center">
                                Reservar producto
                            </Link>
                        </div>

                    ) : (
                        <div className="flex flex-row items-center gap-3">
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="px-5 py-2.5 cursor-pointer bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors duration-200 active:scale-95"
                            >
                                Eliminar
                            </button>
                            <Link to={`/editar-producto/${product._id}`} className="px-5 py-2.5 cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors duration-200 active:scale-95">
                                Editar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ProductCard
