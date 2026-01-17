import CategoryCard from "../components/CategoryCard"
import { useContext } from "react"
import { ContextCategories } from "../context/CategoryContext"
import Loader from "../components/Loader"
import Header from "../components/Header"
import { useNavigate } from "react-router-dom"

const Home = () => {

  const { categories, loadingGetCategories, getSubCategories } = useContext(ContextCategories);

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

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-[#0a0a0a] via-[#001b48] to-[#002855] flex flex-col items-center justify-center py-30 md:py-32 xl:py-30 px-4">

      <Header />

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-20 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      {loadingGetCategories ? (
        <Loader />
      ) : (
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-7xl font-bold bg-linear-to-r py-10 from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
              Bienvenido a <span className="text-white/70">MpComponentes</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Explora nuestras categorías y descubre productos increíbles
            </p>
            <div className="flex items-center justify-center gap-2 text-cyan-400">
              <div className="w-12 h-0.5 bg-linear-to-r from-transparent to-cyan-400"></div>
              <span className="text-sm tracking-wider">CATEGORÍAS</span>
              <div className="w-12 h-0.5 bg-linear-to-l from-transparent to-cyan-400"></div>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <h2 className="text-2xl text-gray-300 font-light">
                  No hay categorías disponibles en este momento
                </h2>
                <p className="text-gray-500 mt-2">Vuelve pronto para ver nuestras novedades</p>
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
        </div>
      )}

      <a className="z-50 underline-0" href="https://wa.me/+5493416085684?text=Hola%2C%20quiero%20más%20información">
        <div className="fixed bottom-5 right-5 xl:right-10 xl:bottom-10 xl:w-20 xl:h-20 w-12 h-12 flex items-center justify-center cursor-pointer transform transale-y-0 hover:-translate-y-2 transition-all duration-300">
          <img src="https://img.icons8.com/?size=100&id=DUEq8l5qTqBE&format=png&color=000000" alt="icon whatsapp" />
        </div>
      </a>
    </section>
  )
}

export default Home