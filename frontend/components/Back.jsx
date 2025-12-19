import { Link } from "react-router-dom"

const Back = ({url}) => {
  return (
    <div>
        <Link className="text-black px-2 py-1 rounded-lg hover:bg-white/90 bg-white text-[18px] absolute top-5 w-24 left-10 cursor-pointer" to={url}>Volver <i className="bi bi-arrow-left"></i></Link>
    </div>
  )
}

export default Back