import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form'
import { sendContactMessageAxios } from '../../api/api';

const Contact = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    async function formSubmit(data) {
        const toastId = toast.loading("Enviando mensaje...")
        try {
            await sendContactMessageAxios(data)
            toast.update(toastId, {
                render: "Mensaje enviado correctamente.",
                type: "success",
                isLoading: false,
                autoClose: 2000
            })
            reset()
        }
        catch (error) {
            console.log(error)
            toast.update(toastId, {
                render: "Error al enviar el mensaje. Intenta nuevamente.",
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
        }
    }

    return (
        <section className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-slate-950 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto pt-16">

                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Contacta con
                        <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Nosotros</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        ¿Tienes alguna pregunta o consulta? Completa el formulario y te responderemos lo antes posible.
                    </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-400/20 p-6 sm:p-8 lg:p-12">
                    <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="group">
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                    Nombre <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register('name', {
                                        required: 'El nombre es obligatorio',
                                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                    })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Tu nombre"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="group">
                                <label htmlFor="surname" className="block text-sm font-medium text-slate-300 mb-2">
                                    Apellido <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="surname"
                                    type="text"
                                    {...register('surname', {
                                        required: 'El apellido es obligatorio',
                                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                    })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Tu apellido"
                                />
                                {errors.surname && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.surname.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
   
                            <div className="group">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email', {
                                        required: 'El email es obligatorio',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email inválido'
                                        }
                                    })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                                    placeholder="tu@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="group">
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                                    Teléfono <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    {...register('phone', {
                                        required: 'El teléfono es obligatorio',
                                        pattern: {
                                            value: /^[0-9+\s()-]{8,}$/,
                                            message: 'Teléfono inválido'
                                        }
                                    })}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                                    placeholder="+54 9 11 1234-5678"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="group">
                            <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                                Mensaje <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                id="message"
                                rows="6"
                                {...register('message', {
                                    required: 'El mensaje es obligatorio',
                                    minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                                    maxLength: { value: 500, message: 'Máximo 500 caracteres' }
                                })}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 resize-none"
                                placeholder="Escribe tu mensaje aquí..."
                            />
                            {errors.message && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.message.message}
                                </p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="group relative w-full py-4 px-6 flex items-center justify-center gap-3 overflow-hidden rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-[1.02]"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                <span className="relative flex items-center gap-2 text-white font-semibold text-lg">
                                    <svg
                                        className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Enviar Mensaje
                                </span>
                            </button>
                        </div>

                    </form>
                </div>

            </div>

            <ToastContainer
                position="bottom-right"
                theme="dark"
                toastClassName="bg-slate-800 text-white"
            />
        </section>
    )
}

export default Contact
