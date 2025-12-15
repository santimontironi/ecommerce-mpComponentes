import Product from "../models/Product.js";
import dayjs from "dayjs";

export const addProduct = async(req,res) => {
    try{
        const {name, image, price, description} = req.body
    }
    catch(error){
        res.status(500).json({message:'Error al agregar producto', error: error.message})
    }
}