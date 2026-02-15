import { Router } from "express";
import { loginAdmin, logoutAdmin, dashboardAdmin } from "../controllers/admin-controllers.js";
import { verifyAdminAuth } from "../middlewares/verify-admin-auth.js";

export const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

router.get("/dashboard", verifyAdminAuth, dashboardAdmin);