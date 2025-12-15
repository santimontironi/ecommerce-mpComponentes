import { addProduct, deleteProduct } from "../controllers/product-controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import { Router } from "express";

export const router = Router()

router.post("/nuevoProducto", verifyToken, addProduct)
router.delete("/eliminarProducto/:id", verifyToken, deleteProduct)