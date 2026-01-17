import { addProduct, deleteProduct, products, productById, editProduct, productsWithoutStock } from "../controllers/product-controller.js";
import { importProducts } from "../controllers/import-products-controller.js";
import { verifyToken } from "../middlewares/verify-token.js";
import { upload } from "../middlewares/multer.js";
import { Router } from "express";

export const router = Router()

router.get("/getAllProductsAdmin/:categoryId", verifyToken, products)
router.get("/getAllProducts/:categoryId", products)
router.get("/getProduct/:id", productById)
router.get("/getProductAdmin/:id", verifyToken, productById)
router.get("/getAllProductsWithoutStock", verifyToken, productsWithoutStock)

router.post("/addProduct", verifyToken, upload.single("image"), addProduct)
router.post("/importProducts", verifyToken, upload.single("file"), importProducts)

router.delete("/deleteProduct/:id", verifyToken, deleteProduct)

router.patch("/editProduct/:id", verifyToken, upload.single("image"), editProduct)