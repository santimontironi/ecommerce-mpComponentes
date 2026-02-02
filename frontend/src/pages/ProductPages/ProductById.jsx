import { useContext } from "react"
import { ContextAdmin } from "../../context/AdminContext"
import { useParams } from "react-router-dom"
import { ProductDetail } from "./ProductDetail"
import { ProductEdited } from "./ProductEdited"

const ProductById = () => {

  const {isAdmin} = useContext(ContextAdmin)

  const { productId } = useParams()

  return (
    <>
      {isAdmin ? <ProductEdited id={productId} /> : <ProductDetail id={productId} />}
    </>
  )
}

export default ProductById
