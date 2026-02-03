import { useContext, useEffect } from "react"
import { ContextAdmin } from "../../context/AdminContext"
import { ContextProducts } from "../../context/ProductsContext"
import { useParams, useNavigate } from "react-router-dom"
import { ContextCategories } from "../../context/CategoryContext"
import { ContextCart } from "../../context/CartContext"
import ProductCard from "../../components/ProductComponents/ProductCard"
import { Loader } from "../../components/UIComponents/Loader"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import { CartIcon } from "../../components/UIComponents/CartIcon"

const Products = () => {
  const { isAdmin } = useContext(ContextAdmin)
  const { getProducts, products, loading, deleteProduct } = useContext(ContextProducts)
  const { categories, getAllCategories, allCategories } = useContext(ContextCategories)
  const cartContext = useContext(ContextCart) || {}
  const { addProductToCart } = cartContext
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const actualCategory = categories.find((c) => c._id === categoryId) || allCategories.find((c) => c._id === categoryId)

  useEffect(() => {
    getProducts(categoryId)
    getAllCategories()
  }, [categoryId])

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

    if (result.isConfirmed) {
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
    <div className="container mx-auto px-4 py-8">
      {!isAdmin && (
        <div className="fixed bottom-4 right-4 z-50">
          <CartIcon />
        </div>
      )}
      
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-linear-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Volver</span>
      </button>

      {loading.loadingGetProducts ? (
        <Loader />
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {actualCategory?.name}
            </h1>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'producto disponible' : 'productos disponibles'}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={onDeleteProduct}
                  addProductToCart={addProductToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No hay productos aún
                </h3>
                <p className="text-gray-500 mb-6">
                  Esta categoría está esperando sus primeros productos. {isAdmin && "¡Comienza agregando uno!"}
                </p>
                {isAdmin && (
                  <Link
                    to={`/admin/products/new/${categoryId}`}
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar Producto
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products