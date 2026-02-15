import Category from "../models/Category.js";
import Product from "../models/Product.js";
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
        if (!req.user) {
            return res.status(401).json({ message: "No autorizado" });
        }

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

    // Marcar todos los productos de esta categoría como inactivos
    await Product.updateMany({ category: categoryId }, { active: false })

    // Después de eliminar todas las hijas y sus productos, marcar la categoría actual como inactiva
    await Category.findByIdAndUpdate(categoryId, { active: false })
}

export const getCategory = async (req, res) => {
    try {
        const { id } = req.params

        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).json({ message: 'Categoria no encontrada' })
        }

        res.status(200).json({
            message: 'Categoria obtenida correctamente',
            category: category
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener categoria', error: error.message })
    }
}

export const editCategory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const { id } = req.params
        const { name } = req.body

        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).json({ message: 'Categoria no encontrada' })
        }

        // Verificar si el nuevo nombre ya existe (excepto si es la misma categoría)
        if (name && name !== category.name) {
            const categoryRepeated = await Category.findOne({ name, active: true, _id: { $ne: id } })
            if (categoryRepeated) {
                return res.status(400).json({ message: 'Ya existe una categoria con ese nombre' })
            }
        }

        // Si se proporciona una nueva imagen
        if (req.file) {
            const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
            const result = await cloudinary.uploader.upload(fileBase64)
            category.image = result.secure_url
        }

        // Actualizar nombre
        if (name) category.name = name

        await category.save()

        res.status(200).json({
            message: 'Categoria actualizada correctamente',
            category: category
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Error al editar categoria', error: error.message })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "No autorizado" });
        }

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