import { useContext, useEffect } from "react"
import { ContextAdmin } from "../context/adminContext"
import { ContextProducts } from "../context/ProductsContext"
import { useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import Loader from "../components/Loader"

const Products = () => {
  const { isAdmin } = useContext(ContextAdmin)
  const { getProducts, products, loadingGetProducts } = useContext(ContextProducts)
  const { categoryId } = useParams()

  useEffect(() => {
    getProducts(categoryId)
  }, [categoryId])

  return (
    <section className="min-h-screen w-full bg-gray-50 px-4 py-10">
      {loadingGetProducts ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Productos
          </h1>

          <div
            className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Products