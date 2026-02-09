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
            .find({ active: true, categoryParent: null })

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
            .find({ active: true, categoryParent: id })

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
        const { name, categoryParent } = req.body
        
        const categoryRepeated = await Category.findOne({ name, active: true })

        if (categoryRepeated) {
            return res.status(400).json({ message: 'La categoria ya existe' })
        }

        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileBase64);

        const category = new Category({ image: result.secure_url, name, categoryParent: (categoryParent && categoryParent !== 'undefined' && categoryParent !== '') ? categoryParent : null })

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

// Función recursiva auxiliar para eliminar categorías y todas sus descendientes
async function deleteCategoryRecursive(categoryId) {
    // Buscar todas las subcategorías hijas directas que están activas
    const subcategories = await Category.find({ categoryParent: categoryId, active: true })

    // Eliminar recursivamente cada subcategoría hija
    for (const subcategory of subcategories) {
        await deleteCategoryRecursive(subcategory._id)
    }

    // Después de eliminar todas las hijas, marcar la categoría actual como inactiva
    await Category.findByIdAndUpdate(categoryId, { active: false })
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params

        // Eliminar recursivamente la categoría y todas sus descendientes
        await deleteCategoryRecursive(id)

        // Obtener la categoría eliminada para devolverla en la respuesta
        const category = await Category.findById(id)

        res.status(200).json({ 
            message: 'Categoria y todas sus subcategorías eliminadas correctamente', 
            category: category 
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoria', error: error.message })
    }
}