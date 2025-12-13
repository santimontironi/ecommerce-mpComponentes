import { Router } from "express";
import { loginAdmin, logoutAdmin } from "../controllers/admin-controllers.js";

export const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);