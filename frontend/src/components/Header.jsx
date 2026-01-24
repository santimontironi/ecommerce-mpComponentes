import { Link } from 'react-router-dom'
import logo from '../img/logo.jpg'
import CartIcon from './CartIcon'

const Header = () => {
  return (
    <header className="fixed p-4 top-0 left-0 right-0 z-50 bg-linear-to-r from-slate-950/95 via-blue-950/95 to-slate-950/95 backdrop-blur-xl border-b border-cyan-400/20 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          <Link to="/" className="group flex items-center gap-3 shrink-0">
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="h-12 w-12 sm:h-16 sm:w-16 lg:h-17 lg:w-17 object-contain rounded-2xl sm:rounded-3xl transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 lg:gap-6">
           
            <CartIcon />

            <Link
              to="/contacto"
              target='_blank'
              className="group relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 flex items-center justify-center rounded-lg bg-linear-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-md hover:shadow-slate-500/30"
            >
              <span className="relative flex items-center gap-1.5 sm:gap-2 text-white font-medium text-sm sm:text-base">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="sm:inline">Contacto</span>
              </span>
            </Link>

            <Link
              to="/ingresar"
              target='_blank'
              className="group relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 flex items-center justify-center overflow-hidden rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <span className="relative flex items-center gap-1.5 sm:gap-2 text-white font-medium text-sm sm:text-base whitespace-nowrap">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden xs:inline sm:inline">Ingreso admin</span>
                <span className="inline xs:hidden sm:hidden">Admin</span>
              </span>
            </Link>
          </nav>

        </div>
      </div>
    </header>
  )
}

export default Header