import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const products = async (req, res) => {
    try {
        const { categoryId } = req.params

        const products = await Product.find({
            active: true,
            category: categoryId
        }).sort({ createdAt: -1 })

        res.status(200).json({
            message: "Productos obtenidos correctamente",
            products
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener productos",
            error: error.message
        })
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

export const productsWithoutStock  = async (req, res) => {
    try{
        const product = await Product.find({
            active: true,
            stock: 0
        })

        return res.status(200).json({ message: 'Productos sin stock obtenidos correctamente', product: product })
    }
    catch(error){
        return res.status(500).json({ message: 'Error al obtener productos sin stock', error: error.message })
    }
}

export const addProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body

        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileBase64);

        const product = new Product({
            name,
            image: result.secure_url,
            price,
            category,
            stock,
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

export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = { ...req.body };

        if (req.file) {
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const result = await cloudinary.uploader.upload(fileBase64);
            updateData.image = result.secure_url;
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            message: "Producto editado correctamente",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al editar producto",
            error: error.message
        });
    }
};