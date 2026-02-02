import { Router } from "express";
import { loginAdmin, logoutAdmin, dashboardAdmin, createAdmin } from "../controllers/admin-controllers.js";
import { verifyToken } from "../middlewares/verify-token.js";

export const router = Router();

router.post("/create-admin", createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

router.get("/dashboard", verifyToken, dashboardAdmin);