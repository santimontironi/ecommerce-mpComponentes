import { useContext, useEffect } from "react"
import { ContextAdmin } from "../context/AdminContext"
import { ContextProducts } from "../context/ProductsContext"
import { useParams } from "react-router-dom"
import { ContextCategories } from "../context/CategoryContext"
import ProductCard from "../components/ProductCard"
import Loader from "../components/Loader"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

const Products = () => {
  const { isAdmin } = useContext(ContextAdmin)
  const { getProducts, products, loadingGetProducts, deleteProduct, loadingDeleteProduct } = useContext(ContextProducts)
  const { categoryId } = useParams()

  useEffect(() => {
    getProducts(categoryId)
  }, [categoryId])

  const { categories } = useContext(ContextCategories)
  const actualCategory = categories.find((c) => c._id === categoryId)

  const onDeleteProduct = async (id) => {

    const result = await Swal.fire({
      title: 'Eliminar producto',
      text: 'Estas seguro de eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if(result.isConfirmed) {

      await Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        text: 'El producto se elimino correctamente',
        timer: 2000,
        showConfirmButton: false
      })

      await deleteProduct(id)
    }

    if (!result.isConfirmed) {
      return
    }

  }

  return (
    <section className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      {loadingGetProducts || loadingDeleteProduct ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
        
          <div className="mb-12 space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              {actualCategory?.name}
            </h1>
            <div className="h-1.5 w-24 bg-linear-to-r from-blue-500 to-purple-500 rounded-full" />
            <p className="text-slate-400 text-lg">
              {products.length} {products.length === 1 ? 'producto disponible' : 'productos disponibles'}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isAdmin={isAdmin}
                  handleDelete={onDeleteProduct}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full" />
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-md">
                  <div className="mb-6">
                    <svg
                      className="w-20 h-20 mx-auto text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    No hay productos aún
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Esta categoría está esperando sus primeros productos. {isAdmin && "¡Comienza agregando uno!"}
                  </p>
                  {isAdmin && (
                    <Link to={'/agregar-producto'} className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105">
                      Agregar Producto
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default Products