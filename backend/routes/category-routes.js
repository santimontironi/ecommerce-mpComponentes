import { Router } from "express";
import { categories, addCategory, deleteCategory, getSubCategories } from "../controllers/category-controller.js";
import {verifyToken} from "../middlewares/verify-token.js";
import {upload} from "../middlewares/multer.js";

export const router = Router()

router.get("/getAllCategories", categories)
router.post("/addCategory", upload.single("image"), verifyToken, addCategory)
router.get("/getSubCategories/:id", getSubCategories)
router.delete("/deleteCategory/:id", verifyToken, deleteCategory)
