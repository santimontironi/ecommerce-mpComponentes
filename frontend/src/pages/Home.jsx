import CategoryCard from "../components/CategoryCard"
import { useContext } from "react"
import { ContextCategories } from "../context/CategoryContext"
import Loader from "../components/Loader"

const Home = () => {

  const { categories, loadingGetCategories } = useContext(ContextCategories);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-linear-120 from-[#101010] to-[#001b48] flex items-center justify-center">

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

      {loadingGetCategories ? <Loader /> : (
        <div>
          {categories.length === 0 && <h2>No hay categorias disponibles</h2>}

          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Home