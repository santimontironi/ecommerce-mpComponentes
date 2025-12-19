import { useContext } from "react"
import { ContextAdmin } from "../context/adminContext"
import Loader from "../components/Loader"
import { Link } from "react-router-dom"
import CategoryList from "../components/CategoryList"

const DashboardAdmin = () => {

  const { admin, loading, logoutAdmin } = useContext(ContextAdmin);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-linear-120 from-[#101010] to-[#001b48] flex justify-center items-center containerDashboard">

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/50 rounded-full blur-3xl" />

      {loading ? <Loader /> : (
        <div className=" 2xl:w-340 xl:w-280 md:w-[90%] w-[95%] min-h-[70vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/40 p-10 flex flex-col gap-8">

      
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-white/70">
                Bienvenido, <span className="font-medium text-white">{admin.username}</span>
              </p>
            </div>

            <Link to="/agregar-categoria" className=" inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/30 hover:scale-[1.02] hover:shadow-blue-500/50 transition-all duration-20" >
              + Agregar categoría
            </Link>
          </header>
        
          <div className="h-px w-full bg-white/20" />

          <section className="flex-1 overflow-y-auto pr-2">
            <CategoryList />
          </section>
          

          <div>
            <button className="absolute bottom-5 right-6 bg-linear-to-r from-red-600 to-red-500 text-white font-medium shadow-lg hover:scale-[1.02] transition-all duration-20 px-4 py-2 rounded-lg cursor-pointer" onClick={logoutAdmin}>Cerrar sesión</button>
          </div>

        </div>
      )}

    </section>
  )
}

export default DashboardAdmin