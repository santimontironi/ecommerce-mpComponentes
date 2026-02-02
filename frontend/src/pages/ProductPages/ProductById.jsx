import { useParams } from "react-router-dom"
import { ProductEdited } from "./ProductEdited"

const ProductById = () => {

  const { productId } = useParams()

  return (
    <ProductEdited id={productId} />
  )
}

export default ProductById
