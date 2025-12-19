import { useContext, useState } from "react"
import { ContextAdmin } from "../context/adminContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import Loader from "../components/Loader";


export const LoginAdmin = () => {

  const { admin, loadingLogin, loginAdmin } = useContext(ContextAdmin);

  const [errorLogin, setErrorLogin] = useState(null)

  const { handleSubmit, register, reset, formState: { errors } } = useForm();

  const navigate = useNavigate()

  async function submitForm(data) {
    try {
      await loginAdmin(data)
      setErrorLogin(null)
      reset();
    } catch (error) {
      if (error?.response?.data?.message) {
        setErrorLogin(error.response.data.message)
        reset()
      }
    }
  }

  useEffect(() => {
    if (admin) {
      navigate("/panel-admin")
    }
  }, [admin, navigate])

  return (
    <section className="relative w-full h-screen overflow-hidden bg-linear-120 from-[#101010] to-[#001b48] flex items-center justify-center containerLoginAdmin">

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      {loadingLogin ? <Loader /> : (
        <div className="flex items-center flex-col gap-2 justify-center">
          <form
            onSubmit={handleSubmit(submitForm)}
            className="w-96 2xl:w-170
            md:w-135 xl:150
            rounded-2xl border border-white/10
            bg-white/5 shadow-2xl px-8 py-10"
          >
            <h1 className="text-2xl font-semibold text-white text-center mb-8">
              Panel Administrador
            </h1>

            <div className="mb-5">
              <label className="block text-sm text-gray-300 mb-2">
                Usuario
              </label>
              <input
                type="text"
                {...register("username", { required: "El nombre de usuario es obligatorio" })}
                className="w-full rounded-lg bg-black/40 border border-white/10
                px-4 py-2.5 text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-600/60"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                {...register("password", { required: "La contraseña es obligatoria" })}
                className="w-full rounded-lg bg-black/40 border border-white/10
                px-4 py-2.5 text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-600/60"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-linear-to-r from-blue-600 to-cyan-500
              py-2.5 text-white font-medium
              hover:from-blue-500 hover:to-cyan-400
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-600/60
              cursor-pointer"
            >
              Iniciar sesión
            </button>
          </form>
          {errorLogin && <p className="text-red-500 font-bold mt-3">{errorLogin}</p>}
        </div>
      )}
    </section>
  )
}
