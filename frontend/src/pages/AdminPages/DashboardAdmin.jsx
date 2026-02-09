import { useContext, useEffect } from "react"
import { ContextAdmin } from "../../context/AdminContext"
import { ContextProducts } from "../../context/ProductsContext"
import { Loader } from "../../components/UIComponents/Loader"
import { Link } from "react-router-dom"
import { CategoryList } from "../../components/CategoryComponents/CategoryList"

const DashboardAdmin = () => {

  const { admin, loading, logoutAdmin } = useContext(ContextAdmin);

  const { productsWithoutStock, getProductsWithoutStock } = useContext(ContextProducts);

  useEffect(() => {
    getProductsWithoutStock();
  }, []);

  return (
    <section className="relative w-full min-h-screen py-12 xl:py-14 xl:pb-5 overflow-x-hidden bg-linear-120 from-[#101010] to-[#001b48] flex justify-center items-center containerDashboard">

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

            <div className="flex flex-col md:flex-row gap-6">
              <Link to="/importar-productos" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-green-600 to-green-400 text-white font-medium shadow-lg shadow-green-500/30 hover:scale-[1.02] hover:shadow-green-500/50 transition-all duration-20 cursor-pointer">
                Cargar productos por CSV
              </Link>
              <Link to="/agregar-categoria" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-yellow-300 to-yellow-400 text-black font-medium shadow-lg shadow-yellow-500/30 hover:scale-[1.02] hover:shadow-yellow-500/50 transition-all duration-20" >
                + Agregar categoría
              </Link>
              <Link to="/agregar-producto" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/30 hover:scale-[1.02] hover:shadow-blue-500/50 transition-all duration-20" >
                + Agregar producto
              </Link>
            </div>

          </header>

          <div className="h-px w-full bg-white/20" />

          {productsWithoutStock && productsWithoutStock.length > 0 && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-100/90 text-sm">
                    <span className="font-semibold text-red-200">Alerta de Stock: </span>
                    {productsWithoutStock.map((product, index) => (
                      <span key={product._id}>
                        <span className="font-medium">{product.name}</span>
                        <span className="text-red-200/60"> (Stock: {product.stock})</span>
                        {index < productsWithoutStock.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          )}

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
