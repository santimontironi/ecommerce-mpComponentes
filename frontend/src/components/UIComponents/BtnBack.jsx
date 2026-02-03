import { useNavigate } from "react-router-dom"

const BtnBack = () => {
    const navigate = useNavigate()
    return (
        <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 hover:border-cyan-400/60 text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-x-1 cursor-pointer absolute xl:left-20 top-6 left-8"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Volver atrás</span>
        </button>
    )
}

export default BtnBack