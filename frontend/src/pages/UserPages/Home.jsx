import { CategoryCard } from "../../components/CategoryComponents/CategoryCard"
import { SearchResults } from "../../components/ProductComponents/SearchResults"
import { NoSearchResults } from "../../components/ProductComponents/noSearchResults"
import { useContext } from "react"
import { ContextCategories } from "../../context/CategoryContext"
import { ContextProducts } from "../../context/ProductsContext"
import { Loader } from "../../components/UIComponents/Loader"
import { Header } from "../../components/UIComponents/Header"
import { useNavigate } from "react-router-dom"

const Home = () => {

  const { categories, loading, getSubCategories } = useContext(ContextCategories);
  const { productsFilter } = useContext(ContextProducts);

  const navigate = useNavigate();

  async function handleCategoryClick(categoryId) {
    try {
      const subcategories = await getSubCategories(categoryId);

      if (subcategories && subcategories.length > 0) {
        navigate(`/categoria/${categoryId}/subcategorias`);
      } else {
        navigate(`/productos/${categoryId}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const showSearchResults = productsFilter?.length > 0
  const showNoResults = productsFilter?.length === 0
  const showCategories = productsFilter === null

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0a0a] via-[#001b48] to-[#002855] flex flex-col items-center justify-center py-30 md:py-32 xl:py-30 px-4">

      <Header />

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-20 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      {loading.loadingGetCategories ? (
        <Loader />
      ) : (
        <div className="relative z-10 w-full max-w-7xl mx-auto">

          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-7xl font-bold bg-linear-to-r py-10 from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
              Bienvenido a <span className="text-white/70">MpComponentes</span>
            </h1>

            {!showSearchResults && (
              <>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                  Explora nuestras categorías y descubre productos increíbles
                </p>
                <div className="flex items-center justify-center gap-2 text-cyan-400">
                  <div className="w-12 h-0.5 bg-linear-to-r from-transparent to-cyan-400"></div>
                  <span className="text-sm tracking-wider">CATEGORÍAS</span>
                  <div className="w-12 h-0.5 bg-linear-to-l from-transparent to-cyan-400"></div>
                </div>
              </>
            )}
          </div>

          {showSearchResults && <SearchResults />}

          {showNoResults && <NoSearchResults />}

          {showCategories && (
            <>
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-2 px-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-500/20 blur-3xl rounded-full" />
                    <div className="relative bg-linear-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-12 max-w-md text-center shadow-2xl">
                      <div className="mb-6">
                        <div className="w-20 h-20 mx-auto bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-cyan-400/30">
                          <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        No hay categorías disponibles
                      </h3>
                      <p className="text-gray-300 text-base leading-relaxed">
                        Aún no se han agregado categorías al catálogo. Vuelve pronto para descubrir nuevos productos.
                      </p>
                      <div className="mt-6 flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                  {categories.map((category, index) => (
                    <CategoryCard
                      key={category._id}
                      category={category}
                      index={index}
                      handleCategoryClick={handleCategoryClick}
                    />
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      )}

      <a className="z-50 underline-0" href="https://wa.me/+5493416085684?text=Hola%2C%20quiero%20más%20información">
        <div className="fixed bottom-3 left-3 xl:left-5 xl:bottom-3 xl:w-20 xl:h-20 w-12 h-12 flex items-center justify-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300">
          <img src="https://img.icons8.com/?size=100&id=DUEq8l5qTqBE&format=png&color=000000" alt="icon whatsapp" />
        </div>
      </a>
    </section>
  )
}

export default Home