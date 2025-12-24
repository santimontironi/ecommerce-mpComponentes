import { useContext } from "react"
import { ContextCategories } from "../context/CategoryContext"
import { ContextProducts } from "../context/ProductsContext"
import { useForm } from "react-hook-form"
import Loader from "../components/Loader"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const AddProduct = () => {

  const { categories } = useContext(ContextCategories)
  const { addProduct, loadingAddProduct } = useContext(ContextProducts)

  const { handleSubmit, register, reset, formState: { errors } } = useForm()

  const navigate = useNavigate()

  async function submitForm(data) {
    try {
      const formdata = new FormData()

      formdata.append("image", data.image[0])
      formdata.append("name", data.name)
      formdata.append("description", data.description)
      formdata.append("price", data.price)
      formdata.append("category", data.category)

      await addProduct(formdata)

      Swal.fire({
        icon: "success",
        title: "Producto creado",
        text: "El producto se creo correctamente",
        timer: 2000,
        showConfirmButton: false
      })

      navigate("/panel-admin")
    }
    catch (error) {
      console.log(error)
      reset()
    }
  }

  return (
    <section className="containerAddProduct">
      {loadingAddProduct ? <Loader /> : (
        <div>
          <form onSubmit={handleSubmit(submitForm)} method="post">

            <div className="mb-3">
              <label htmlFor="image">Imagen</label>
              <input type="file" className="form-control" id="image" {...register("image", { required: true })} />
              {errors.image && <p className="text-danger">La imagen es requerida</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre</label>
              <input type="text" className="form-control" id="name" {...register("name", { required: true })} />
              {errors.name && <p className="text-danger">El nombre es requerido</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="description">Descripcion</label>
              <input type="text" className="form-control" id="description" {...register("description", { required: true })} />
              {errors.description && <p className="text-danger">La descripcion es requerida</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="price">Precio</label>
              <input type="number" className="form-control" id="price" {...register("price", { required: true })} />
              {errors.price && <p className="text-danger">El precio es requerido</p>}
            </div>

            {categories.length > 0 && (
              <div className="mb-3">
                <label htmlFor="category">Categoria</label>
                <select className="form-select" id="category" {...register("category", { required: true })}>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-danger">La categoria es requerida</p>}
              </div>
            )}

            <button type="submit">Agregar producto</button>
          </form>
        </div>
      )}
    </section>
  )
}

export default AddProduct