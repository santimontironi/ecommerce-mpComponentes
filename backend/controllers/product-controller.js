import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import mail_transporter from "../config/nodemailer_config.js";
import dotenv from "dotenv";

dotenv.config()

export const products = async (req, res) => {
    try {
        const { categoryId } = req.params

        // Filtro base
        const filter = { active: true }

        // Si viene categoryId → filtramos por categoría
        if (categoryId) {
            filter.category = categoryId
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: "Productos obtenidos correctamente",
            products: products
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

export const productsWithoutStock = async (req, res) => {
    try {
        const products = await Product.find({
            active: true,
            stock: { $lt: 5 }
        })

        return res.status(200).json({ message: 'Productos sin stock obtenidos correctamente', products: products })
    }
    catch (error) {
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

export const orderProduct = async (req, res) => {
    try {
        const { name, surname, email, phone, productName } = req.body

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Nuevo encargo: ${productName}`,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f6f8fb; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #303030; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
                        
                        <h2 style="color: #fff; margin-bottom: 16px;">
                        📦 Nuevo pedido de producto
                        </h2>

                        <p style="color: #fff; margin-bottom: 20px;">
                        Se recibió un nuevo encargo desde la web con los siguientes datos:
                        </p>

                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <tr>
                            <td style="padding: 8px 0; color: #fff;">Producto</td>
                            <td style="padding: 8px 0; color:#fff; font-weight: 600;">${productName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #fff;">Nombre</td>
                            <td style="padding: 8px 0; color:#fff;">${name} ${surname}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #fff;">Email</td>
                            <td style="padding: 8px 0; color:#fff;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #fff;">Teléfono</td>
                            <td style="padding: 8px 0; color:#fff;">${phone}</td>
                        </tr>
                        </table>

                        <div style="margin-top: 24px; text-align: center;">
                        <a href="mailto:${email}" 
                            style="display: inline-block; padding: 10px 18px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
                            Responder al cliente
                        </a>
                        </div>

                        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />

                        <p style="font-size: 12px; color: #fff; text-align: center;">
                        Enviado automáticamente desde el formulario web.
                        </p>

                    </div>
                </div>
            `
        }

        await mail_transporter.sendMail(mailOptions)

        return res.status(200).json({ message: 'Pedido enviado correctamente' })

    } catch (error) {
        return res.status(500).json({
            message: 'Error al encargar producto',
            error: error.message
        })
    }
}















