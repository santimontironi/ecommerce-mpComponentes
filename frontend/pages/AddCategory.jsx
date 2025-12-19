import { useContext } from "react";
import { ContextCategories } from "../context/CategoryContext";
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";

const AddCategory = () => {
    const { addCategory, loadingAddCategory } = useContext(ContextCategories);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    function onSubmit(data) {
        const formData = new FormData();

        formData.append("image", data.image[0]);
        formData.append("name", data.name);

        addCategory(formData);
        reset();
    };

    return (
        <section className="relative w-full h-screen overflow-hidden bg-linear-120 from-[#101010] to-[#001b48] flex items-center justify-center">

            {loadingAddCategory ? <Loader /> : (

                <div className="w-95 md:w-105 2xl:w-200 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

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
            )}

        </section>
    );
};

export default AddCategory;