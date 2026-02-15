import { addProduct, deleteProduct, products, productById, editProduct, productsWithoutStock, orderProduct } from "../controllers/product-controller.js";
import { importProducts } from "../controllers/import-products-controller.js";
import { verifyTokenRoutes } from "../middlewares/verify-token-routes.js";
import { upload } from "../middlewares/multer.js";
import { Router } from "express";

export const router = Router()

router.get("/getProductsAdmin/:categoryId", verifyTokenRoutes, products)
router.get("/getProducts/:categoryId", products)
router.get('/getAllProducts', products)
router.get("/getProduct/:id", productById)
router.get("/getProductAdmin/:id", verifyTokenRoutes, productById)
router.get("/getAllProductsWithoutStock", verifyTokenRoutes, productsWithoutStock)

router.post("/addProduct", verifyTokenRoutes, upload.single("image"), addProduct)
router.post("/importProducts", verifyTokenRoutes, upload.single("file"), importProducts)
router.post("/orderProduct", orderProduct)

router.delete("/deleteProduct/:id", verifyTokenRoutes, deleteProduct)

router.patch("/editProduct/:id", verifyTokenRoutes, upload.single("image"), editProduct)