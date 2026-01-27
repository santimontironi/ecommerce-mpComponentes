import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ContextProducts } from "../../context/ProductsContext"
import Swal from "sweetalert2"
import { Loader } from "../../components/UIComponents/Loader"

const ImportProducts = () => {

    const { loading, importProducts } = useContext(ContextProducts)
    const [result, setResult] = useState(null)
   
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()

    const navigate = useNavigate()

    const selectedFile = watch('file')?.[0]

    const onSubmit = async (data) => {
        
        const formData = new FormData()
        formData.append('file', data.file[0])

        try {
            const response = await importProducts(formData)
            setResult(response)
            Swal.fire({
                icon: 'success',
                title: 'Productos importados',
                text: 'Los productos se importaron correctamente',
                timer: 2000,
                showConfirmButton: false
            })
            navigate('/panel-admin')
        } catch (error) {
            console.error('Error al importar:', error)
            if(error?.response?.data?.message) {
                console.log(error.response.data.message)
            }
        }
    }

    const handleReset = () => {
        reset()
        setResult(null)
    }

    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-linear-120 from-[#101010] to-[#001b48] flex justify-center items-center py-10">

            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/50 rounded-full blur-3xl" />

            {loading.loadingImportProducts ? <Loader /> : (
                <div className="2xl:w-340 xl:w-280 md:w-[90%] w-[95%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/40 p-10 flex flex-col gap-8 relative z-10">

                    <header className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to='/panel-admin'
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                            >
                                ← Volver
                            </Link>
                            <div>
                                <h1 className="text-3xl font-semibold text-white tracking-tight">
                                    Importar Productos
                                </h1>
                                <p className="text-sm text-white/70">
                                    Carga productos masivamente desde CSV o Excel
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className="h-px w-full bg-white/20" />

                    {/* Instrucciones */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <span className="text-blue-400 text-xl">ℹ️</span>
                            <div className="text-white/90 text-sm space-y-2">
                                <p className="font-semibold">Formato del archivo:</p>
                                <ul className="list-disc list-inside space-y-1 text-white/70">
                                    <li>El archivo debe ser CSV o Excel (.xlsx, .xls)</li>
                                    <li>Columnas requeridas: <span className="text-white font-mono">name, price, description, category</span></li>
                                    <li>Columnas opcionales: <span className="text-white font-mono">image, active</span></li>
                                    <li>El campo <span className="text-white font-mono">category</span> debe ser un ID válido de categoría</li>
                                    <li>Máximo 100 productos por importación</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Área de carga */}
                    {!result && (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="border-2 border-dashed border-white/30 hover:border-white/50 bg-white/5 rounded-xl p-12 text-center transition-all duration-200">
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".csv,.xlsx,.xls"
                                    {...register('file', {
                                        required: 'Debes seleccionar un archivo',
                                        validate: {
                                            validType: (files) => {
                                                if (!files || files.length === 0) return true
                                                const file = files[0]
                                                const validTypes = [
                                                    'application/vnd.ms-excel',
                                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                                    'text/csv'
                                                ]
                                                return validTypes.includes(file.type) ||
                                                    file.name.endsWith('.csv') ||
                                                    file.name.endsWith('.xlsx') ||
                                                    file.name.endsWith('.xls') ||
                                                    'Por favor selecciona un archivo CSV o Excel válido'
                                            }
                                        }
                                    })}
                                    className="hidden"
                                />

                                {!selectedFile ? (
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                        <div className="text-6xl">📄</div>
                                        <div>
                                            <p className="text-white font-medium mb-2">
                                                Haz clic para seleccionar un archivo
                                            </p>
                                            <p className="text-white/60 text-sm">
                                                Formatos soportados: CSV, XLSX, XLS
                                            </p>
                                        </div>
                                    </label>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="text-6xl">✅</div>
                                        <div>
                                            <p className="text-white font-medium mb-1">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-white/60 text-sm">
                                                {(selectedFile.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="text-red-400 hover:text-red-300 text-sm underline"
                                        >
                                            Cambiar archivo
                                        </button>
                                    </div>
                                )}

                                {errors.file && (
                                    <p className="text-red-400 text-sm mt-4">
                                        {errors.file.message}
                                    </p>
                                )}
                            </div>

                            {selectedFile && (
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/30 hover:scale-[1.02] hover:shadow-blue-500/50 transition-all duration-200"
                                >
                                    Importar Productos
                                </button>
                            )}
                        </form>
                    )}

                    
                </div>
            )}
        </section>
    )
}

export default ImportProducts
