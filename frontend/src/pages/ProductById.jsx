import { useContext } from "react"
import { ContextCategories } from "../context/CategoryContext"
import { ContextProducts } from "../context/ProductsContext"

const ProductById = () => {

  const {} = useContext(ContextCategories)
  const {} = useContext(ContextProducts)

  return (
    <div>ProductById</div>
  )
}

export default ProductById