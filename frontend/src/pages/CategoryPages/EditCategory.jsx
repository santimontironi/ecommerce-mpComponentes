import { useContext, useEffect, useState } from "react";
import { ContextCategories } from "../../context/CategoryContext";
import { useForm } from "react-hook-form";
import { Loader } from "../../components/UIComponents/Loader";
import Swal from 'sweetalert2';
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
    const { editCategory, loading, getCategory, category } = useContext(ContextCategories);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getCategory(id)
    }, [id])


    async function onSubmit(data) {
        try {
            const formData = new FormData();

            formData.append("name", data.name);

            if (data.image && data.image.length > 0) {
                formData.append("image", data.image[0]);
            }

            await editCategory(id, formData);

            Swal.fire({
                icon: "success",
                title: "Categoría actualizada",
                text: "La categoría se actualizó correctamente",
                timer: 2000,
                showConfirmButton: false
            });

            navigate("/panel-admin");

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo actualizar la categoría",
            });
            reset();
        }
    }
    
    return (
        <section className="relative w-full h-screen overflow-hidden bg-linear-120 from-[#101010] to-[#001b48] flex flex-col gap-2 items-center justify-center containerEditCategory">

            {loading.loadingEditCategory ? <Loader /> : (

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
                            Editar categoría
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Computadoras"
                                    {...register("name")}
                                    defaultValue={category.name}
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

                            {category.image && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Imagen actual
                                    </label>
                                    <img
                                        src={category.image}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Nueva imagen
                                </label>
                                <input
                                    type="file"
                                    {...register("image")}
                                    className={`file:mr-3 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:bg-blue-600 file:text-white
                                    hover:file:bg-blue-700
                                    cursor-pointer
                                    border rounded-xl px-2 py-1
                                    border-gray-300
                                    transition`}
                                />
                                <p className="text-xs text-gray-500">
                                    Si no seleccionas una imagen, se mantendrá la actual
                                </p>
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
                                Actualizar categoría
                            </button>

                        </form>

                    </div>
                </div>
            )}
        </section>
    );
};

export default EditCategory;
