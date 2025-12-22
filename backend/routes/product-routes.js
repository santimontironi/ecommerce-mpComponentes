import { addProduct, deleteProduct, products, productById } from "../controllers/product-controller.js";
import { verifyToken } from "../middlewares/verify-token.js";
import { upload } from "../middlewares/multer.js";
import { Router } from "express";

export const router = Router()

router.get("/getAllProductsAdmin", verifyToken, products)
router.get("/getAllProducts", products)
router.get("/getProduct/:id", productById)
router.post("/addProduct", verifyToken, upload.single("image"), addProduct)
router.delete("/deleteProduct/:id", verifyToken, deleteProduct)