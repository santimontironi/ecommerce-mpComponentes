const CategoryCard = ({ category, index, handleCategoryClick }) => {
  return (
    <article onClick={() => handleCategoryClick(category._id)} className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20" style={{ animationDelay: `${index * 100}ms`, animation: 'fadeInUp 0.6s ease-out forwards' }}>
      <div className="relative h-64 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
       
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      <div className="relative p-6 space-y-3">
        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
          {category.name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
          {category.description}
        </p>

        <div className="flex items-center gap-2 text-cyan-400 font-medium text-sm pt-2">
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            Explorar categoría
          </span>
          <svg
            className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/50" />
      </div>
    </article>
  )
}

export default CategoryCard