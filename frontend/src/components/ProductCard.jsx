const ProductCard = ({ product, isAdmin }) => {
    return (
        <div className="relative bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/40 hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 group">
            <div className="relative w-full h-56 bg-black overflow-hidden">
                <img src={product.image} alt={`Imagen del producto ${product.name}`} className=" w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-white line-clamp-1">
                    {product.name}
                </h2>

                <p className="text-sm text-slate-400 line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-500">
                        ${product.price}
                    </span>

                    {!isAdmin ? (
                        <button
                            className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 active:scale-95 transition-all">
                            Agregar
                        </button>
                    ) : (
                        <button
                            className="px-4 py-2 text-sm font-semibold bg-red-600/90 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all">
                            Eliminar
                        </button>
                    )}
                </div>
            </div>

            <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-t from-blue-500/10 to-transparent"
            />
        </div>
    )
}

export default ProductCard