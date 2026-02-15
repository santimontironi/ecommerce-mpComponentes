import { ContextProducts } from '../../context/ProductsContext'
import { useContext, useState } from 'react'

export const FormSearch = () => {

    const { searchProducts } = useContext(ContextProducts)

    const [search, setSearch] = useState('')

    const handleSearch = (e) => {
        const value = e.target.value
        setSearch(value)
        searchProducts(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const clearSearch = () => {
        setSearch('')
        searchProducts('')
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-1 max-w-70 sm:max-w-md items-center gap-1.5 sm:gap-2 bg-slate-800/50 border border-slate-400 px-2 py-2.5 sm:px-4 sm:py-2.5 rounded-lg hover:border-cyan-500/40 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all"
        >
            <svg
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={handleSearch}
                className="flex-1 bg-transparent outline-none text-white placeholder-slate-400 text-xs sm:text-base min-w-0"
            />
            {search && (
                <button
                    type="button"
                    onClick={clearSearch}
                    className="text-slate-400 hover:text-white transition-colors shrink-0"
                >
                    <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </form>
    )
}

export default FormSearch