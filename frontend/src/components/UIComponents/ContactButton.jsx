import { Link } from "react-router-dom"

export const ContactButton = () => {
    return (
        <Link
            to={"/contacto"}
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
                <span>Contacto</span>
            </span>
        </Link>
    )
}

export default ContactButton