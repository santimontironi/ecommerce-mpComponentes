import { sendContactMessage } from "../controllers/contact-controller.js";
import { Router } from "express";

export const router = Router()

router.post('/sendContactMessage', sendContactMessage)
