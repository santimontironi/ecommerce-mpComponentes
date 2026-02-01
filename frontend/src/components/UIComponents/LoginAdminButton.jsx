import { Link } from "react-router-dom"

export const LoginAdminButton = () => {
    return (
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
    )
}

export default LoginAdminButton
