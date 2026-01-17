import { useContext } from "react"
import { ContextCategories } from "../context/CategoryContext"
import Loader from "./Loader"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

const CategoryList = () => {

  const { categories, loadingGetCategories, deleteCategory, getSubCategories } = useContext(ContextCategories)

  const navigate = useNavigate()

  async function handleDelete(id, e) {
    e.stopPropagation()
    try {
      const result = await Swal.fire({
        title: "Eliminar categoría",
        text: "Estas seguro de eliminar esta categoría?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) {
        return;
      }

      await deleteCategory(id);

      Swal.fire({
        icon: "success",
        title: "Categoría eliminada",
        text: "La categoría se elimino correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      throw error;
    }
  }

  //esta funcion es como preguntar ¿esta categoría tiene hijas?
  async function handleCategoryClick(categoryId) {
    try {

      // se buscan subcategorías donde parent === categoryId
      const subcategories = await getSubCategories(categoryId);

      //si hay subcategorias se redirige a subcategorias, ya que categoryId es el padre
      if (subcategories && subcategories.length > 0) {
        navigate(`/categoria/${categoryId}/subcategorias`);
      } else {
        navigate(`/categoria/${categoryId}`);
      }
    } catch (error) {
      console.error('Error:', error);
      navigate(`/categoria/${categoryId}/productos`);
    }
  }

  return (
    <>
      {loadingGetCategories ? <Loader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {categories.map((category) => {

            return (
              <article onClick={() => handleCategoryClick(category._id)}
                key={category._id}
                className="group cursor-pointer bg-linear-to-r from-blue-600 to-cyan-500 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/50 transition-all duration-300">

                <div className="relative h-40 overflow-hidden">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>


                <button
                  onClick={(e) => handleDelete(category._id, e)} className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors duration-200 cursor-pointer">
                  <i className="bi bi-trash-fill text-sm"></i>
                </button>

                <div className="p-2 space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    {category.name}
                  </h3>

                </div>
              </article>

            )

          })}

          {categories.length === 0 && (
            <div className="text-center py-10">
              <h2 className="text-lg text-white/70">
                No hay categorías disponibles
              </h2>
            </div>
          )}

        </div >
      )}
    </>
  )
}

export default CategoryList