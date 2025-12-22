import { useContext, useEffect } from "react"
import { ContextAdmin } from "../context/adminContext"
import { ContextProducts } from "../context/ProductsContext"
import { useParams } from "react-router-dom"

const Products = () => {

  const {isAdmin} = useContext(ContextAdmin)
  const {getProducts, products} = useContext(ContextProducts)

  const {categoryId} = useParams()

  useEffect(() => {
    getProducts(categoryId)
  },[categoryId])

  return (
    <section className="min-h-screen w-full">
      <div>

      </div>
    </section>
  )
}

export default Products