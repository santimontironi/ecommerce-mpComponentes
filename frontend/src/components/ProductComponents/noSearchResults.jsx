import { Link } from "react-router-dom"

export const NoSearchResults = () => {
  return (
    <div className="text-center py-2 animate-fade-in">
      <div className="inline-block p-10 bg-white/5 backdrop-blur-sm rounded-2xl border border-cyan-400/20 max-w-2xl">
        <svg
          className="w-20 h-20 mx-auto mb-6 text-cyan-400/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <h2 className="text-3xl text-white font-bold mb-4">
          No encontramos ese producto
        </h2>

        <p className="text-gray-300 text-lg mb-6">
          ¡Pero no te preocupes! Podemos conseguir lo que necesitas
        </p>

        <div className="bg-linear-to-r from-blue-600/20 to-cyan-600/20 border border-cyan-400/30 rounded-lg p-6 mb-6">
          <p className="text-cyan-300 font-semibold mb-3">
            📋 ¿Buscás algo específico?
          </p>
          <p className="text-gray-400 text-sm">
            Completá nuestro formulario y te ayudamos a encontrar el producto que necesitás.
            ¡Hacemos pedidos especiales!
          </p>
        </div>

        <Link
          to={"/formulario-pedido"}
          target="_blank"
          className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Rellenar Formulario de Pedido
        </Link>
      </div>
    </div>
  )
}

export default NoSearchResults