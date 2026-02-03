import { useContext } from "react"
import { ContextCategories } from "../../context/CategoryContext"
import { ContextProducts } from "../../context/ProductsContext"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Loader } from "../../components/UIComponents/Loader"
import Swal from "sweetalert2"

const AddProduct = () => {

  const { categories } = useContext(ContextCategories)
  const { addProduct, loading } = useContext(ContextProducts)
  const navigate = useNavigate()

  const { handleSubmit, register, reset, formState: { errors } } = useForm()

  async function submitForm(data) {
    try {
      const formdata = new FormData()

      formdata.append("image", data.image[0])
      formdata.append("name", data.name)
      formdata.append("description", data.description)
      formdata.append("price", data.price)
      formdata.append("stock", data.stock)
      formdata.append("category", data.category)

      await addProduct(formdata)

      Swal.fire({
        icon: "success",
        title: "Producto creado",
        text: "El producto se creo correctamente",
        timer: 2000,
        showConfirmButton: false
      })

      reset()
    }
    catch (error) {
      console.log(error)
      reset()
    }
  }

  return (
    <section className="min-h-screen w-full bg-linear-to-br from-black via-blue-900 to-black flex items-center justify-center px-4 py-8">

      {loading.loadingAddProduct ? <Loader /> : (
        <div className="w-full max-w-xl">

          {/* Botón para volver atrás */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1"
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

          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">

            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Agregar producto
            </h1>

            <form onSubmit={handleSubmit(submitForm)} method="post" className="space-y-4">

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen
                </label>
                <input
                  type="file"
                  id="image"
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700
                  cursor-pointer"
                  {...register("image", { required: true })}
                />
                {errors.image && <p className="text-sm text-red-600 mt-1">La imagen es requerida</p>}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  {...register("name", { required: true })}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">El nombre es requerido</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  type="text"
                  id="description"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  {...register("description", { required: true })}
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">La descripción es requerida</p>}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  id="price"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  {...register("price", { required: true })}
                />
                {errors.price && <p className="text-sm text-red-600 mt-1">El precio es requerido</p>}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  {...register("stock", { required: true })}
                />
                {errors.stock && <p className="text-sm text-red-600 mt-1">El Stock es requerido</p>}
              </div>

              {categories.length > 0 && (
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    id="category"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    {...register("category", { required: true })}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-sm text-red-600 mt-1">La categoría es requerida</p>}
                </div>
              )}

              <button
                type="submit"
                className="
                  w-full mt-4 py-3 rounded-lg
                  bg-linear-to-r from-blue-600 to-blue-800
                  text-white font-semibold
                  hover:from-blue-700 hover:to-blue-900
                  transition-all duration-300
                  shadow-lg
                  cursor-pointer
                "
              >
                Agregar producto
              </button>

            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default AddProduct