import { addProduct, deleteProduct, products, productById, editProduct } from "../controllers/product-controller.js";
import { verifyToken } from "../middlewares/verify-token.js";
import { upload } from "../middlewares/multer.js";
import { Router } from "express";

export const router = Router()

router.get("/getAllProductsAdmin/:categoryId", verifyToken, products)
router.get("/getAllProducts/:categoryId", products)
router.get("/getProduct/:id", verifyToken, productById)
router.post("/addProduct", verifyToken, upload.single("image"), addProduct)
router.delete("/deleteProduct/:id", verifyToken, deleteProduct)
router.patch("/editProduct/:id", verifyToken, upload.single("image"), editProduct)