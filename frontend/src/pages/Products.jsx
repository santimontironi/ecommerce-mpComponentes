import { useContext, useEffect } from "react"
import { ContextAdmin } from "../context/adminContext"
import { ContextProducts } from "../context/ProductsContext"
import { useParams } from "react-router-dom"
import { ContextCategories } from "../context/CategoryContext"
import ProductCard from "../components/ProductCard"
import Loader from "../components/Loader"

const Products = () => {
  const { isAdmin } = useContext(ContextAdmin)
  const { getProducts, products, loadingGetProducts, deleteProduct, loadingDeleteProduct } = useContext(ContextProducts)
  const { categoryId } = useParams()

  useEffect(() => {
    getProducts(categoryId)
  }, [categoryId])

  const {categories} = useContext(ContextCategories)

  const actualCategory = categories.find((c) => c._id === categoryId)

  const onDeleteProduct = async (id) => {
    await deleteProduct(id)
  }

  return (
    <section className="min-h-screen w-full bg-linear-to-br from-black via-slate-900 to-black px-4 py-14">
      {loadingGetProducts || loadingDeleteProduct ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10 text-white tracking-tight">
            {actualCategory?.name}
          </h1>

          <div
            className="
              grid gap-8
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isAdmin={isAdmin}
                handleDelete={onDeleteProduct}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Products