import { Router } from "express";
import { allCategories, categoriesWithoutParents, addCategory, deleteCategory, getSubCategories, getCategory, editCategory } from "../controllers/category-controller.js";
import { verifyTokenRoutes } from "../middlewares/verify-token-routes.js";
import {upload} from "../middlewares/multer.js";

export const router = Router()

router.get("/getAllCategories", allCategories)
router.get("/getAllCategoriesWithoutParents", categoriesWithoutParents)
router.get("/getSubCategories/:id", getSubCategories)
router.get("/getCategory/:id", getCategory)

router.post("/addCategory", verifyTokenRoutes, upload.single("image"), addCategory)

router.patch("/editCategory/:id", verifyTokenRoutes, upload.single("image"), editCategory)

router.delete("/deleteCategory/:id", verifyTokenRoutes, deleteCategory)
