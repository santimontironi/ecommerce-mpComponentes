import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ContextCategories } from "../../context/CategoryContext"
import { ContextAdmin } from "../../context/AdminContext"
import { Loader } from "../../components/UIComponents/Loader"
import Swal from "sweetalert2"

const SubcategoryList = () => {
    const { categoryId } = useParams()

    const { getSubCategories, deleteCategory, loading } = useContext(ContextCategories)

    const { isAdmin } = useContext(ContextAdmin)

    const navigate = useNavigate()

    const [subcategories, setSubcategories] = useState([])

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const data = await getSubCategories(categoryId)
                setSubcategories(data)
            } catch (error) {
                console.error("Error:", error)
            }
        }

        fetchSubcategories()
    }, [categoryId])

    async function handleDelete(id, e) {
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
            })

            if (!result.isConfirmed) return

            await deleteCategory(id)
            setSubcategories(prev => prev.filter(sub => sub._id !== id))

            Swal.fire({
                icon: "success",
                title: "Subcategoría eliminada",
                text: "La subcategoría se eliminó correctamente",
                timer: 2000,
                showConfirmButton: false,
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar la subcategoría",
            })
        }
    }

    return (
        <section className="relative w-full min-h-screen py-12 xl:py-0 overflow-hidden bg-linear-120 from-[#101010] to-[#001b48] flex justify-center items-center">

            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/50 rounded-full blur-3xl" />

            {loading.loadingGetSubCategories ? (
                <Loader />
            ) : (
                <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="group cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                <i className="bi bi-arrow-left text-lg"></i>
                                <span className="font-medium">Volver</span>
                            </button>

                            <div>
                                <h1 className="text-4xl font-bold text-white tracking-tight">
                                    Subcategorías
                                </h1>
                                <p className="text-sm text-white/60 mt-1">
                                    {subcategories.length} {subcategories.length === 1 ? 'subcategoría' : 'subcategorías'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {subcategories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 px-6">
                            <div className="w-20 h-20 mb-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                                <i className="bi bi-folder-x text-4xl text-white/40"></i>
                            </div>
                            <h2 className="text-2xl font-semibold text-white/90 mb-2">
                                No hay subcategorías
                            </h2>
                            <p className="text-white/60 text-center max-w-md">
                                Aún no se han creado subcategorías para esta categoría
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subcategories.map((subcategory) => (
                                <article
                                    key={subcategory._id}
                                    onClick={() => navigate(`/productos/${subcategory._id}`)}
                                    className="group cursor-pointer bg-linear-to-r from-blue-600 to-cyan-500 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/50 transition-all duration-300"
                                >
                                    <div className="relative h-80 overflow-hidden">
                                        <img
                                            src={subcategory.image}
                                            alt={subcategory.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                        {isAdmin && (
                                            <button
                                                onClick={(e) => handleDelete(subcategory._id, e)}
                                                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                                            >
                                                <i className="bi bi-trash-fill text-sm"></i>
                                            </button>
                                        )}


                                        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-linear-to-r from-blue-500/80 to-cyan-500/80 backdrop-blur-sm border border-white/20">
                                            <span className="text-xs font-semibold text-white">
                                                Subcategoría
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-white">
                                            {subcategory.name}
                                        </h3>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

export default SubcategoryList
