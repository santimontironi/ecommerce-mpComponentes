import { addProduct, deleteProduct, products, productById } from "../controllers/product-controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import upload from "../middlewares/multer.js";
import { Router } from "express";

export const router = Router()

router.get("/getAllProductsAdmin", verifyToken, products)
router.post("/nuevoProducto", verifyToken, upload.single("image"), addProduct)
router.delete("/eliminarProducto/:id", verifyToken, deleteProduct)
router.get("/getAllProducts", products)
router.get("/obtenerProducto/:id", productById)