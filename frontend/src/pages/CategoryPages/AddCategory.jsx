import { useContext } from "react";
import { ContextCategories } from "../../context/CategoryContext";
import { useForm } from "react-hook-form";
import { Loader } from "../../components/UIComponents/Loader";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
    const { addCategory, loading, allCategories } = useContext(ContextCategories);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate()

    async function onSubmit(data) {
        try {
            const formData = new FormData();

            formData.append("image", data.image[0]);
            formData.append("name", data.name);
            formData.append("categoryParent", data.categoryParent);

            await addCategory(formData);
            navigate("/panel-admin")

            Swal.fire({
                icon: "success",
                title: "Categoría creada",
                text: "La categoría se agregó correctamente",
                timer: 2000,
                showConfirmButton: false
            });


        }
        catch (error) {
            if (error?.response?.data?.message) {

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response.data.message,
                });

                reset();
            }
        }
    };

    return (
        <section className="relative w-full h-screen overflow-hidden bg-linear-120 from-[#101010] to-[#001b48] flex flex-col gap-2 items-center justify-center containerAddCategory">

            {loading.loadingAddCategory ? <Loader /> : (

                <div className="w-95 md:w-105 2xl:w-200">

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

                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

                        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                            Agregar categoría
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Computadoras"
                                    {...register("name", {
                                        required: "El nombre es obligatorio",
                                    })}
                                    className={`px-4 py-2 rounded-xl border 
                                    ${errors.name ? "border-red-400" : "border-gray-300"}
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/60
                                    transition`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {allCategories.length > 0 && (
                                <div>
                                    <label htmlFor="categoryParent" className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría padre
                                    </label>
                                    <select
                                        id="categoryParent"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        {...register("categoryParent")}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {allCategories.map((category) => (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Imagen
                                </label>
                                <input
                                    type="file"
                                    {...register("image", {
                                        required: "La imagen es obligatoria"
                                    })}
                                    className={`file:mr-3 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:bg-blue-600 file:text-white
                                    hover:file:bg-blue-700
                                    cursor-pointer
                                    border rounded-xl px-2 py-1
                                    ${errors.image ? "border-red-400" : "border-gray-300"}
                                    transition`}
                                />
                                {errors.image && (
                                    <p className="text-red-500 text-xs">
                                        {errors.image.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 rounded-xl font-medium text-white
                                bg-linear-to-r from-blue-600 to-blue-500
                                hover:from-blue-700 hover:to-blue-600
                                shadow-lg shadow-blue-500/30
                                active:scale-[0.98]
                                transition-all
                                cursor-pointer"
                            >
                                Crear categoría
                            </button>

                        </form>

                    </div>
                </div>
            )}
        </section>
    );
};

export default AddCategory;