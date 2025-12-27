import { Link } from 'react-router-dom'
import logo from '../img/logo.jpg'

const Header = () => {
  return (
    <header className="fixed p-4 top-0 left-0 right-0 z-50 bg-linear-to-r from-slate-950/95 via-blue-950/95 to-slate-950/95 backdrop-blur-xl border-b border-cyan-400/20 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative">
              <img 
                src={logo}
                alt="Logo" 
                className="h-17 w-17 object-contain rounded-3xl transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link 
              to="/ingresar"
              target='_blank'
              className="group relative px-3 py-2 md:px-6 md:py-2.5 overflow-hidden rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative flex items-center gap-2 text-white font-medium">
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Ingresar como administrador
              </span>
            </Link>
          </nav>

        </div>
      </div>
    </header>
  )
}

export default Header