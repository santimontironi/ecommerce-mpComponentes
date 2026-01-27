import { useContext, useEffect } from "react"
import { ContextProducts } from "../../context/ProductsContext"
import { Loader } from "../../components/UIComponents/Loader"

export const ProductDetail = ({ id }) => {
  const { getProduct, productById, loading } = useContext(ContextProducts)

  useEffect(() => {
    getProduct(id)
  }, [id])

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6 lg:p-8">
      {loading.loadingGetProduct ? (
        <Loader />
      ) : (
        <article className="max-w-6xl w-full bg-slate-800/30 backdrop-blur-md border border-slate-700/30 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">

          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[150]">

            <div className="relative lg:col-span-3 h-80 sm:h-96 lg:h-auto bg-linear-to-br from-slate-950 to-slate-900 overflow-hidden group">
              <img
                src={productById.image}
                alt={`Imagen del producto ${productById.name}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60" />

              <div className="absolute top-6 right-6 px-4 py-2 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full">
                <span className="text-blue-300 text-sm font-medium">Destacado</span>
              </div>
            </div>

            <div className="lg:col-span-2 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">

              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 bg-slate-700/50 text-slate-300 text-xs font-medium rounded-full uppercase tracking-wider">
                    Producto
                  </span>

                  <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
                    {productById.name}
                  </h1>
                </div>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  {productById.description}
                </p>
              </div>

              <div className="space-y-6">
                <div className="pt-6 border-t border-slate-700/30">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      ${productById.price}
                    </span>
                    <span className="text-slate-500 text-lg">ARS</span>
                  </div>
                </div>

                <button className="w-full cursor-pointer group relative px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-lg font-semibold rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Agregar al carrito
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-1000" />
                </button>
              </div>

            </div>

          </div>

        </article>
      )}
    </section>
  )
}
