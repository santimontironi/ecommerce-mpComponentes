import { Link } from "react-router-dom"

export const Back = ({ url }) => {
    return (
        <Link className="text-black px-2 py-1 rounded-lg hover:bg-white/90 bg-white text-[18px] absolute top-5 w-24 left-10 cursor-pointer z-40" to={url}>Volver <i className="bi bi-arrow-left"></i></Link>
    )
}

export default Back
