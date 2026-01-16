import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ContextCategories } from "../context/CategoryContext"
import Loader from "../components/Loader"
import Swal from "sweetalert2"

const SubcategoryList = () => {
    const { categoryId } = useParams()
    const { getSubCategories, deleteCategory } = useContext(ContextCategories)
    const navigate = useNavigate()

    const [subcategories, setSubcategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const data = await getSubCategories(categoryId)
                setSubcategories(data)
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSubcategories()
    }, [categoryId])

    async function handleDelete(e, id) {
        e.stopPropagation()

        try {
            const result = await Swal.fire({
                title: "Eliminar subcategoría",
                text: "¿Estás seguro de eliminar esta subcategoría?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (!result.isConfirmed) {
                return;
            }

            await deleteCategory(id);
            setSubcategories(prev => prev.filter(sub => sub._id !== id))

            Swal.fire({
                icon: "success",
                title: "Subcategoría eliminada",
                text: "La subcategoría se eliminó correctamente",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar la subcategoría",
            });
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Loader />
            </div>
        )
    }

    return (
        <div className="p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-white hover:underline"
            >
                ← Volver
            </button>

            <h1 className="text-3xl font-bold text-white mb-6">
                Subcategorías
            </h1>

            {subcategories.length === 0 ? (
                <div className="text-center py-10">
                    <h2 className="text-lg text-white/70">
                        No hay subcategorías disponibles
                    </h2>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subcategories.map((subcategory) => (
                        <article
                            onClick={() => navigate(`/categoria/${subcategory._id}`)}
                            key={subcategory._id}
                            className="group relative cursor-pointer bg-linear-to-r from-blue-600 to-cyan-500 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/50 transition-all duration-300"
                        >
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={subcategory.image}
                                    alt={subcategory.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <button
                                onClick={(e) => handleDelete(e, subcategory._id)}
                                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors duration-200 z-10"
                            >
                                <i className="bi bi-trash-fill text-sm"></i>
                            </button>

                            <div className="p-2 space-y-2">
                                <h3 className="text-lg font-semibold text-white">
                                    {subcategory.name}
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SubcategoryList