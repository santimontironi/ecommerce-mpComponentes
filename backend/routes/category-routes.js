import { Router } from "express";
import { categories, addCategory, deleteCategory } from "../controllers/category-controller.js";
import {upload} from "../middlewares/multer.js";

export const router = Router()

router.get("/getAllCategories", categories)
router.post("/addCategory", upload.single("image"), addCategory)
router.delete("/deleteCategory/:id", deleteCategory)
