import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const addProduct = async(req,res) => {
    try{
        const {name, price, description} = req.body

        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileBase64);

        const product = new Product({
            name,
            image: result.secure_url,
            price,
            description
        })

        await product.save();

        res.status(201).json({message:'Producto agregado correctamente', product: product})
    }
    catch(error){
        res.status(500).json({message:'Error al agregar producto', error: error.message})
    }
}

export const deleteProduct = async (req,res) => {
    try{
        const {productId} = req.params

        const product = await Product.findByIdAndUpdate(productId, {active: false})

        res.status(200).json({message:'Producto eliminado correctamente', product: product})
    }
    catch(error){
        res.status(500).json({message:'Error al eliminar producto', error: error.message})
    }
}