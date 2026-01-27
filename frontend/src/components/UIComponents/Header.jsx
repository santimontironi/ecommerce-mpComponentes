import { Link } from 'react-router-dom'
import logo from '../../img/logo.jpg'
import { CartIcon } from './CartIcon'
import { ContactButton } from './ContactButton'
import { LoginAdminButton } from '../SecurityComponents/LoginAdminButton'
import { FormSearch } from './FormSearch'

export const Header = () => {

  return (
    <header className="fixed p-4 top-0 left-0 right-0 z-50 bg-linear-to-r from-slate-950/95 via-blue-950/95 to-slate-950/95 backdrop-blur-xl border-b border-cyan-400/20 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20">

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

          <FormSearch />

          <nav className="flex items-center gap-2 sm:gap-3 lg:gap-4">

            <ContactButton />
            <LoginAdminButton />
            <CartIcon />
          </nav>

        </div>
      </div>
    </header>
  )
}

export default Header
