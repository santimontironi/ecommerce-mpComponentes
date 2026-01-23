import { useContext, useEffect } from "react"
import { ContextProducts } from "../context/ProductsContext"
import Loader from "../components/Loader"
import Swal from "sweetalert2"
import Back from "../components/Back"
import { ContextCategories } from "../context/CategoryContext"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"

const ProductEdited = ({ id }) => {

  const { editProduct, loadingEditProduct, productById, getProduct } = useContext(ContextProducts)
  const { categories } = useContext(ContextCategories)

  const { handleSubmit, register, reset } = useForm()

  const navigate = useNavigate()

  useEffect(() => {
    getProduct(id)
  }, [id])

  async function submitForm(data) {
    try {
      const formdata = new FormData()

      formdata.append("image", data.image[0] || productById.image)
      formdata.append("name", data.name || productById.name)
      formdata.append("description", data.description || productById.description)
      formdata.append("price", data.price || productById.price)
      formdata.append("stock", data.stock || productById.stock)
      formdata.append("category", data.category || productById.category)

      await editProduct(id,formdata)

      Swal.fire({
        icon: 'question',
        title: '¿Seguro deseas editar este producto?',
        showDenyButton: true,
        confirmButtonText: 'Si, editar',
        denyButtonText: `No, cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Producto editado',
            text: 'El producto se edito correctamente',
            timer: 2000,
            showConfirmButton: false
          })

          navigate('/panel-admin')
        } else if (result.isDenied) {
          Swal.fire({
            icon: 'info',
            title: 'Operación cancelada',
            text: 'El producto no se edito',
            timer: 2000,
            showConfirmButton: false
          })
        }
      })

      reset()
    }
    catch (error) {
      console.log(error)
      reset()
    }
  }

  return (
    <section className="min-h-screen w-full bg-linear-to-br from-blue-600 via-blue-900 to-black flex items-center justify-center px-4">

      <Back url="/panel-admin" />

      {loadingEditProduct ? <Loader /> : (
        <div className="w-full max-w-xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 mt-20 mb-10">

          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Editar producto {productById.name}
          </h1>

          <form onSubmit={handleSubmit(submitForm)} method="post" className="space-y-4">

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Imagen
              </label>

              {productById?.image && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                  <img
                    src={productById.image}
                    alt={productById.name}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              <input type="file" id="image" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" {...register("image")}/>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                defaultValue={productById.name}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                {...register("name")}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                type="text"
                id="description"
                defaultValue={productById.description}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                {...register("description")}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                id="price"
                defaultValue={productById.price}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                {...register("price")}
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                defaultValue={productById.stock}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                {...register("stock")}
              />
            </div>

            {categories.length > 0 && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  id="category"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  defaultValue={productById?.category}
                  {...register("category")}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
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
              Editar producto
            </button>

          </form>
        </div>
      )}
    </section>
  )
}

export default ProductEdited