import { Router } from "express";
import { allCategories, categoriesWithoutParents, addCategory, deleteCategory, getSubCategories } from "../controllers/category-controller.js";
import {verifyToken} from "../middlewares/verify-token.js";
import {upload} from "../middlewares/multer.js";

export const router = Router()

router.get("/getAllCategories", allCategories)
router.get("/getAllCategoriesWithoutParents", categoriesWithoutParents)
router.get("/getSubCategories/:id", getSubCategories)
router.post("/addCategory", upload.single("image"), verifyToken, addCategory)
router.delete("/deleteCategory/:id", verifyToken, deleteCategory)
