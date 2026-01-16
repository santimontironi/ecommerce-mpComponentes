import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

export const allCategories = async (req, res) => {
    try {
        const categories = await Category
            .find({ active: true })

        res.status(200).json({
            message: "Categorias obtenidas correctamente",
            categories: categories
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener categorias",
            error: error.message
        });
    }
}

export const categoriesWithoutParents = async (req, res) => {
    try {
        const categories = await Category
            .find({ active: true, parent: null })

        res.status(200).json({
            message: "Categorias obtenidas correctamente",
            categories: categories
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener categorias",
            error: error.message
        });
    }
};

export const getSubCategories = async (req, res) => {
    try {
        const { id } = req.params

        const categories = await Category
            .find({ active: true, parent: id })

        res.status(200).json({
            message: "Categorias obtenidas correctamente",
            categories: categories
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener categorias",
            error: error.message
        });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { name, parent } = req.body

        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileBase64);

        const categoryRepeated = await Category.findOne({ name, active: true })

        if (categoryRepeated) {
            return res.status(400).json({ message: 'La categoria ya existe' })
        }

        const category = new Category({ image: result.secure_url, name, parent: parent || null })

        await category.save()

        res.status(201).json({
            message: 'Categoria agregada correctamente',
            category: category
        });

    }
    catch (error) {
        res.status(500).json({ message: 'Error al agregar categoria', error: error.message })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        // Marcar la categoría padre como inactiva
        const category = await Category.findByIdAndUpdate(id, { active: false })

        // Encontrar y marcar todas las subcategorías como inactivas
        await Category.updateMany({ parent: id }, { active: false })

        res.status(200).json({ message: 'Categoria eliminada correctamente', category: category })
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoria', error: error.message })
    }
}