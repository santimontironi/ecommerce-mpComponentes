import { Router } from "express";
import { loginAdmin, logoutAdmin, dashboardAdmin } from "../controllers/admin-controllers.js";
import { verifyToken } from "../middlewares/verify-token.js";

export const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

router.get("/dashboard", verifyToken, dashboardAdmin);