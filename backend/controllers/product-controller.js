import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const products = async (req, res) => {
    try {
        const { category } = req.query

        if(!category){
            return res.status(400).json({ message: 'La categoria es requerida' })
        }
        
        const products = await Product.find({ active: true, category: category }).sort({ createdAt: -1 })
        res.status(200).json({ message: 'Productos obtenidos correctamente', products: products })
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message })
    }
}

export const productById = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        res.status(200).json({ message: 'Producto obtenido correctamente', product: product })
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error: error.message })
    }
}

export const addProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body

        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileBase64);

        const product = new Product({
            name,
            image: result.secure_url,
            price,
            category,
            description
        })

        await product.save();

        res.status(201).json({ message: 'Producto agregado correctamente', product: product })
    }
    catch (error) {
        res.status(500).json({ message: 'Error al agregar producto', error: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const product = await Product.findByIdAndUpdate(id, { active: false })

        res.status(200).json({ message: 'Producto eliminado correctamente', product: product })
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message })
    }
}