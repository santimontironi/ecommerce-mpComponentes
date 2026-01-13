import XLSX from 'xlsx';
import cloudinary from "../config/cloudinary.js";
import axios from 'axios';
import Product from '../models/Product.js';

export const importProducts = async (req, res) => {
    try {
        // Subir el archivo a Cloudinary
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        const uploadResult = await cloudinary.uploader.upload(fileBase64, {
            resource_type: 'raw', // importante para archivos no-imagen
            folder: 'product-imports'
        });

        // Descargar el archivo desde Cloudinary para procesarlo
        const response = await axios.get(uploadResult.secure_url, {
            responseType: 'arraybuffer'
        });

        // Procesar el archivo
        const workbook = XLSX.read(response.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({
                message: 'El archivo está vacío'
            });
        }

        const results = {
            success: [],
            errors: []
        };

        // Procesar cada fila
        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            try {
                if (!row.name || !row.price || !row.description || !row.category) {
                    results.errors.push({
                        row: i + 2,
                        data: row,
                        error: 'Faltan campos requeridos'
                    });
                    continue;
                }

                const product = new Product({
                    name: row.name,
                    image: row.image || 'https://via.placeholder.com/400',
                    price: parseFloat(row.price),
                    description: row.description,
                    category: row.category,
                    active: row.active !== undefined ? row.active : true
                });

                await product.save();

                results.success.push({
                    row: i + 2,
                    product: product.name
                });

            } catch (error) {
                results.errors.push({
                    row: i + 2,
                    data: row,
                    error: error.message
                });
            }
        }

        // Opcional: eliminar el archivo de Cloudinary después de procesarlo
        await cloudinary.uploader.destroy(uploadResult.public_id, {
            resource_type: 'raw'
        });

        res.status(200).json({
            message: 'Importación completada',
            total: data.length,
            exitosos: results.success.length,
            errores: results.errors.length,
            detalles: results
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al importar productos',
            error: error.message
        });
    }
};