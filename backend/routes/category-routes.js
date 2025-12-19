import { Router } from "express";
import { categories, addCategory, deleteCategory } from "../controllers/category-controller.js";

export const router = Router()

router.get("/getAllCategories", categories)
router.post("/addCategory", addCategory)
router.delete("/deleteCategory/:id", deleteCategory)
