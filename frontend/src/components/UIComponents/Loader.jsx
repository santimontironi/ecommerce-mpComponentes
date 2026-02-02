import { ClipLoader } from "react-spinners";

export const Loader = () => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <ClipLoader size={50} color={"#fff"} loading={true} />
        </div>
    )
}

export default Loader
