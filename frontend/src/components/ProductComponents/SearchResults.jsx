import { useContext } from "react"
import { ContextProducts } from "../../context/ProductsContext"
import { ContextCart } from "../../context/CartContext"
import { ContextAdmin } from "../../context/AdminContext"
import { ProductCard } from "./ProductCard"
import { Loader } from "../UIComponents/Loader"

export const SearchResults = () => {
    const { productsFilter, loading } = useContext(ContextProducts)
    const { addProductToCart } = useContext(ContextCart)
    const { isAdmin } = useContext(ContextAdmin)

    if (productsFilter.length === 0) {
        return null
    }

    return (
        <div>
            {loading.loadingProductsFilter && <Loader />}
            <div className="text-center mb-16 space-y-4 animate-fade-in">
                <p className="text-gray-300 text-lg md:text-xl">
                    Encontramos <span className="text-cyan-400 font-semibold">{productsFilter.length}</span> resultado{productsFilter.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center justify-center gap-2 text-cyan-400">
                    <div className="w-12 h-0.5 bg-linear-to-r from-transparent to-cyan-400"></div>
                    <span className="text-sm tracking-wider">RESULTADOS</span>
                    <div className="w-12 h-0.5 bg-linear-to-l from-transparent to-cyan-400"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                {productsFilter.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        isAdmin={isAdmin}
                        addProductToCart={addProductToCart}
                    />
                ))}
            </div>
        </div>
    )
}

export default SearchResults
