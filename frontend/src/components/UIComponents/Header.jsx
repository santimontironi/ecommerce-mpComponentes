import { Link } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../img/logo.jpg'
import { CartIcon } from './CartIcon'
import { ContactButton } from './ContactButton'
import { LoginAdminButton } from './LoginAdminButton'
import { FormSearch } from './FormSearch'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed p-4 top-0 left-0 right-0 z-50 bg-linear-to-r from-slate-950/95 via-blue-950/95 to-slate-950/95 backdrop-blur-xl border-b border-cyan-400/20 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-20">

          <Link to="/" className="group flex items-center gap-3 shrink-0">
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 object-contain rounded-xl sm:rounded-2xl lg:rounded-3xl transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </div>
          </Link>

          <div className="flex-1 min-w-0 max-w-xs sm:max-w-xl">
            <FormSearch />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-cyan-400 hover:text-cyan-300 transition-colors relative z-50"
              aria-label="Menú"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>

            <div className="scale-75 sm:scale-100 origin-right">
              <CartIcon />
            </div>

            <nav className="hidden lg:flex items-center gap-3 lg:gap-4">
              <ContactButton />
              <LoginAdminButton />
            </nav>
          </div>

        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col gap-3 py-4 border-t border-cyan-400/20">
            <div onClick={toggleMenu}>
              <ContactButton />
            </div>
            <div onClick={toggleMenu}>
              <LoginAdminButton />
            </div>
          </nav>
        </div>

      </div>
    </header>
  )
}

export default Header