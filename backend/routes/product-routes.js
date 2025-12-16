import { addProduct, deleteProduct, products, productById } from "../controllers/product-controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";
import { Router } from "express";

export const router = Router()

router.get("/obtenerProductos", verifyToken, products)
router.get("/obtenerProducto/:id", verifyToken, productById)
router.post("/nuevoProducto", verifyToken, upload.single("image"), addProduct)
router.delete("/eliminarProducto/:id", verifyToken, deleteProduct)