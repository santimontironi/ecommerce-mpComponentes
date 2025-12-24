const ProductCard = ({ product, isAdmin }) => {
    return (
        <div className=" bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">

            <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                <img src={product.image} alt={`Imagen del producto ${product.name}`} className=" w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>

            <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {product.name}
                </h2>

                <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                        ${product.price}
                    </span>

                    {!isAdmin ? (
                        <button className=" px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Agregar al carrito
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button className=" px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductCard