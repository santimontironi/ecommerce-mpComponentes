import { createPreference } from "../controllers/preference-controller.js";
import { Router } from "express";

export const router = Router();

router.post("/createPreference", createPreference);