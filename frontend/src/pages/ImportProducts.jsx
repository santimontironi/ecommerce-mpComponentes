import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ContextProducts } from "../context/ProductsContext"
import Loader from "../components/Loader"

const ImportProducts = () => {

    const { loadingImportProducts, importProducts } = useContext(ContextProducts)
    const [result, setResult] = useState(null)

    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const onSubmit = async (data) => {
        if (!data.file || data.file.length === 0) {
            alert('Por favor selecciona un archivo')
            return
        }

        const formData = new FormData()
        formData.append('file', data.file[0])

        try {
            const response = await importProducts(formData)
            setResult(response)
            reset()
        } catch (error) {
            console.error('Error al importar:', error)
            if (error?.response?.data?.message) {
                alert(error.response.data.message)
            } else {
                alert('Error al importar productos')
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

            {loadingImportProducts ? <Loader /> : (
                <div className="2xl:w-340 xl:w-280 md:w-[90%] w-[95%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/40 p-10 flex flex-col gap-8 relative z-10">

                    {/* Header */}
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
                            <div className="space-y-2">
                                <label className="block text-white text-sm font-medium mb-2">
                                    Selecciona el archivo
                                </label>
                                <input
                                    type="file"
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
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-blue-400 file:cursor-pointer hover:file:bg-blue-500/30"
                                />
                                {errors.file && (
                                    <p className="text-red-400 text-sm mt-2">
                                        {errors.file.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/30 hover:scale-[1.02] hover:shadow-blue-500/50 transition-all duration-200"
                            >
                                Importar Productos
                            </button>
                        </form>
                    )}

                    {/* Resultados */}
                    {result && (
                        <div className="space-y-6">
                            {/* Resumen */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                    <p className="text-blue-400 text-sm font-medium mb-2">Total</p>
                                    <p className="text-white text-3xl font-bold">{result.total}</p>
                                </div>
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                    <p className="text-green-400 text-sm font-medium mb-2">✓ Exitosos</p>
                                    <p className="text-white text-3xl font-bold">{result.exitosos}</p>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                    <p className="text-red-400 text-sm font-medium mb-2">✗ Errores</p>
                                    <p className="text-white text-3xl font-bold">{result.errores}</p>
                                </div>
                            </div>

                            {/* Lista de productos exitosos */}
                            {result.exitosos > 0 && result.products && result.products.length > 0 && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 max-h-64 overflow-y-auto">
                                    <h3 className="text-green-400 font-semibold mb-4">Productos importados exitosamente:</h3>
                                    <div className="space-y-2">
                                        {result.products.map((product, index) => (
                                            <div key={index} className="bg-black/20 rounded-lg p-3">
                                                <p className="text-white/90 text-sm">
                                                    {product.name} - ${product.price}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Lista de errores */}
                            {result.errores > 0 && result.detalles && result.detalles.errors && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-h-64 overflow-y-auto">
                                    <h3 className="text-red-400 font-semibold mb-4">Productos con errores:</h3>
                                    <div className="space-y-3">
                                        {result.detalles.errors.map((error, index) => (
                                            <div key={index} className="bg-black/20 rounded-lg p-4">
                                                <p className="text-white/90 text-sm mb-1">
                                                    Fila {error.row}: <span className="text-red-400">{error.error}</span>
                                                </p>
                                                <p className="text-white/60 text-xs">
                                                    {JSON.stringify(error.data)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200"
                                >
                                    Importar otro archivo
                                </button>
                                <Link
                                    to='/panel-admin'
                                    className="flex-1 py-4 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg shadow-blue-500/30 hover:scale-[1.02] hover:shadow-blue-500/50 transition-all duration-200 flex items-center justify-center"
                                >
                                    Volver al Dashboard
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </section>
    )
}

export default ImportProducts