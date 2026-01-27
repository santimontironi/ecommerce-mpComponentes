import { useContext } from "react"
import { ContextProducts } from "../../context/ProductsContext"
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from "react-hook-form"

const OrderProduct = () => {

  const { orderProduct } = useContext(ContextProducts)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  async function formSubmit(data) {
    const toastId = toast.loading("Enviando encargue...")
    try {
      await orderProduct(data)
      toast.update(toastId, {
        render: "Encargue enviado correctamente.",
        type: "success",
        isLoading: false,
        autoClose: 2000
      })
      reset()
    }
    catch (error) {
      console.log(error)
      toast.update(toastId, {
        render: "Error al enviar el encargue. Intenta nuevamente.",
        type: "error",
        isLoading: false,
        autoClose: 3000
      })
    }
  }

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 py-12 px-4 relative overflow-hidden">

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-20 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />


      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block p-3 bg-cyan-500/10 rounded-2xl mb-4">
            <svg
              className="w-16 h-16 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Encargar Producto
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            ¿No encontraste lo que buscás? Completá el formulario y te ayudamos a conseguirlo
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-cyan-400/20 p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-cyan-300">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Tu nombre"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="surname" className="block text-sm font-semibold text-cyan-300">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="surname"
                  {...register("surname", {
                    required: "El apellido es obligatorio",
                  })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Tu apellido"
                />
                {errors.surname && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.surname.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-cyan-300">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
                    }
                  })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-cyan-300">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone", {
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^[0-9+\s()-]+$/,
                      message: "Teléfono inválido"
                    }
                  })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="+54 9 11 1234-5678"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="productName" className="block text-sm font-semibold text-cyan-300">
                Nombre del producto *
              </label>
              <input
                type="text"
                id="productName"
                {...register("productName", {
                  required: "El nombre del producto es obligatorio",
                })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="¿Qué producto necesitás?"
              />
              {errors.productName && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-cyan-300">
                Descripción y detalles
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows="4"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                placeholder="Agregá cualquier detalle adicional: marca, modelo, características específicas, cantidad, etc."
              />
            </div>

            <div className="bg-linear-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-400/30 rounded-xl p-4">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-cyan-300 font-semibold text-sm mb-1">
                    Te contactaremos pronto
                  </p>
                  <p className="text-gray-400 text-xs">
                    Revisaremos tu solicitud y te enviaremos un presupuesto en las próximas 24-48 horas.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer px-8 py-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Enviar Solicitud
            </button>

          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            ¿Preferís contactarnos directamente?{" "}

            <a href="https://wa.me/+5493416085684"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline font-semibold transition-colors">Escribinos por WhatsApp</a>

          </p>
        </div>

      </div>
      
      <ToastContainer/>
    </section >
  )
}

export default OrderProduct