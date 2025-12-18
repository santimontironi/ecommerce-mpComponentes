import { CircularProgress } from "react-loader-spinner";

const Loader = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            render(<CircularProgress
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="circular-progress-loading"
                wrapperStyle={{}}
                wrapperClass="wrapper-class"
                visible={true}
                strokeWidth={2}
                animationDuration={1}
            />)
        </div>
    )
}

export default Loader